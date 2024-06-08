import { sql } from "@/components/db";
import { rawTimeFromNow } from "@/components/utilities";
import { getBot } from "@/components/bot";
import nodemailer from "nodemailer";

async function sendEmail(userEmail, message) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: "Proposal Alerts from Tribuni",
    html: message,
  };

  await transporter.sendMail(mailOptions);
}

export async function generateMarkdownAndSendEmail({
  subscriptions,
  userEmail,
  username,
  chatid,
}) {
  let markdown = "";
  let isFirstProtocol = true;
  let currentProtocol = "";
  let protocolProposalCounts = {};

  for (const subscription of subscriptions) {
    const { protocol_id, protocol, title, endtime, url } = subscription;
    const votingLink =
      url && url !== "undefined" ? `👉 <a href="${url}">Vote Now</a>` : "";

    if (protocol !== currentProtocol) {
      if (!isFirstProtocol) {
        markdown += "<br>";
      }
      markdown += `<b>Protocol:</b> <a href="${process.env.SERVER_URL}/proposals?protocol=${protocol_id}&username=${username}&chatid=${chatid}">${protocol}</a>`;
      isFirstProtocol = false;
      currentProtocol = protocol;
      protocolProposalCounts[currentProtocol] = 0;
    }

    protocolProposalCounts[currentProtocol]++;

    markdown += `<br>${
      protocolProposalCounts[currentProtocol]
    }. <i>${title}</i><br>🔴 <i>Ends in ${rawTimeFromNow(
      parseInt(endtime)
    )}</i> | ${votingLink}<br>`;
  }
  markdown += `\n\n<a href="${process.env.SERVER_URL}/settings?username=${username}&chatid=${chatid}">Manage Alert Settings</a>`

  await sendEmail(userEmail, markdown);
}

export async function POST(req) {
  const bot = getBot();

  try {
    const body = await req.json().catch(() => null);

    if (body && body.test && body.username && body.userEmail) {
      console.log("test email alert");

      const { username, chatid, userEmail } = body;

      const testSubscriptionQuery = `
        SELECT p.id,
              pr.id as protocol_id,
              pr.name AS protocol,
              p.title,
              p.endTime,
              p.url
        FROM proposals p
        JOIN protocols pr ON p.protocol = pr.id
        WHERE p.protocol IN (SELECT unnest(subscriptions) FROM telegram_users WHERE id = '${username}')
          AND p.endTime > EXTRACT(epoch FROM NOW())::INT
        ORDER BY pr.name ASC;
      `;

      const testSubscriptions = await sql.unsafe(testSubscriptionQuery);

      if (testSubscriptions.length !== 0) {
        await generateMarkdownAndSendEmail({
          subscriptions: testSubscriptions,
          userEmail,
          username,
          chatid,
        });

        return Response.json({
          code: 201,
          status: "success",
          message: "Test email alert sent successfully",
        }, { status: 201 });
      } else {
        return Response.json({
          code: 404,
          status: "error",
          message: "No subscriptions found for the test user",
        }, { status: 404 });
      }
    }
    
    const usersQuery = `
      SELECT *
      FROM telegram_users
      WHERE pause_alerts = FALSE
        AND email_alerts = TRUE
        AND last_email_alert + duration < ${Math.floor(Date.now() / 1000)};
    `;

    const users = await sql.unsafe(usersQuery);

    if (users.length !== 0) {
      const promises = users.map(async (user) => {
        const subscriptionsQuery = `
          SELECT p.id,
                 pr.id as protocol_id,
                 pr.name AS protocol,
                 p.title,
                 p.endTime,
                 p.url
          FROM proposals p
          JOIN protocols pr ON p.protocol = pr.id
          WHERE p.protocol IN (SELECT unnest(subscriptions) FROM telegram_users WHERE id = '${user.id}')
            AND p.endTime > EXTRACT(epoch FROM NOW())::INT
          ORDER BY pr.name ASC;
        `;

        const subscriptions = await sql.unsafe(subscriptionsQuery);

        if (subscriptions.length !== 0) {
          try {
            await generateMarkdownAndSendEmail({
              subscriptions,
              userEmail: user.email,
              username: user.username,
              chatid: user.chatid,
            });

            await sql.unsafe(`
              UPDATE telegram_users
              SET last_email_alert = ${Math.floor(Date.now() / 1000)}
              WHERE id = '${user.id}';
            `);
          } catch (err) {
            console.log('Failed to send email to user', user.username);
          }
        }
      });

      await Promise.all(promises);
    }

    return Response.json({
      code: 201,
      status: "success",
      message: "Email alerts sent successfully",
    }, { status: 201 });

  } catch (err) {
    console.log(err);
    return Response.json({
      code: 400,
      status: "error",
    }, { status: 400 });
  }
}

