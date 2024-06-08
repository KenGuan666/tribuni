import { sql } from "@/components/db";
import { rawTimeFromNow } from "@/components/utilities";
import { getBot } from "@/components/bot";

export function generateMarkdown({ subscriptions, username, chatid }) {
  let markdown = "";
  let isFirstProtocol = true;
  let currentProtocol = "";
  let protocolProposalCounts = {}; // Object to store proposal counts for each protocol

  for (const subscription of subscriptions) {
    const { protocol_id, protocol, title, endtime, url } = subscription;
    const votingLink =
      url && url !== "undefined" ? `👉 [Vote Now](${url})` : "";

    // Initialize proposal count for the current protocol if it's the first time encountering it
    if (protocol !== currentProtocol) {
      if (!isFirstProtocol) {
        markdown += "\n";
      }
      markdown += `*Protocol:* [${protocol}](${process.env.SERVER_URL}/proposals?protocol=${protocol_id}&username=${username}&chatid=${chatid})`;
      isFirstProtocol = false;
      currentProtocol = protocol;
      protocolProposalCounts[currentProtocol] = 0;
    }

    // Increment proposal count for the current protocol
    protocolProposalCounts[currentProtocol]++;

    // Generate markdown with proposal number relative to the current protocol
    markdown += `\n${
      protocolProposalCounts[currentProtocol]
    }. _${title}_ \n🔴 _Ends in ${rawTimeFromNow(
      parseInt(endtime)
    )}_ | ${votingLink}\n`;

    // Break the loop if 10 proposals have been processed for the current protocol
    if (protocolProposalCounts[currentProtocol] >= 10) {
      break;
    }
  }

  markdown += `\n[Manage Alert Settings](${process.env.SERVER_URL}/settings?username=${username}&chatid=${chatid})`

  return markdown;
}

export async function POST(req) {
  const bot = getBot();

  try {
    const body = await req.json().catch(() => null);

    if (body && body.test && body.username && body.chatid) {
      console.log("test alert");

      const { username, chatid } = body;

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
      const testMarkdown = generateMarkdown({
        subscriptions: testSubscriptions,
        username,
        chatid,
      });

      if (testSubscriptions.length !== 0) {
        await bot.sendMessage(chatid, `${testMarkdown}`, {
          parse_mode: "Markdown",
        });

        return Response.json({
          code: 201,
          status: "success",
          message: "Test alert sent successfully",
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
        AND telegram_alerts = TRUE
        AND last_telegram_alert + duration < ${Math.floor(Date.now() / 1000)};
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

        if (!user.username || !user.chatid) return null;

        const markdown = generateMarkdown({
          subscriptions,
          username: user.username,
          chatid: user.chatid,
        });

        if (subscriptions.length !== 0) {
          try {
            await bot.sendMessage(user.chatid, `${markdown}`, {
              parse_mode: "Markdown",
            });

            await sql.unsafe(`
              UPDATE telegram_users
              SET last_telegram_alert = ${Math.floor(Date.now() / 1000)}
              WHERE id = '${user.id}';
            `);
          } catch (err) {
            console.log('failed to send chat to user', user.username);
          }
        }
      });

      await Promise.all(promises);
    }

    return Response.json({
      code: 201,
      status: "success",
    }, { status: 201 });

  } catch (err) {
    console.log(err);
    return Response.json({
      code: 400,
      status: "error",
    }, { status: 400 });
  }
}

