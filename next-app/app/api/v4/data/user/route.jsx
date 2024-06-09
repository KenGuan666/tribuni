import { BASE_USER } from "@/components/constants";
import { sql, sanitizeText } from "@/components/db";

export async function POST(req) {
	try {
		const body = await req.json();
		
		const query = `
        SELECT *
        FROM telegram_users
        WHERE id = '${sanitizeText(body.id)}' AND chatid = '${sanitizeText(
			body.chatid
		)}';
	`;

		let data = await sql.unsafe(query);
		return Response.json({
			status: "success",
			user: data[0] === undefined ? BASE_USER : data[0],
		}, { status: 201 });
	} catch (err) {
		console.log(err);
		return Response.json({
			status: "error",
			user: BASE_USER,
		}, { status: 403 });
	}
}
