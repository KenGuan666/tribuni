"use server";

import { sql } from "@/components/db";

export const ChangeAlerts = async ({ type, username }) => {
	try {
		const query = `
		UPDATE telegram_users
SET ${type} = NOT ${type}
WHERE id = '${username}';
`;

		const res = await sql.unsafe(query);

		return {
			result: res.result,
		};
	} catch (err) {
		return {
			result: false,
		};
	}
};

export const ChangeAlertFrequency = async ({ username, duration }) => {
	try {
		const query = `
		UPDATE telegram_users
SET duration = ${duration}
WHERE id = '${username}';
`;

		const res = await sql.unsafe(query);

		return {
			result: res.result,
		};
	} catch (err) {
		return {
			result: false,
		};
	}
};

export const ChangeAlertTime = async ({ username, alertHour, alertMinute, alertOffset }) => {
	
	const alertTime = (alertHour - parseInt(alertOffset)) * 3600 + alertMinute * 60 + 0;
	
	try {
		const query = `
		UPDATE telegram_users
		SET alert_time = '${alertTime}'
		WHERE id = '${username}';
		`;

		const res = await sql.unsafe(query);

		return {
			result: res.result,
		};
	} catch (err) {
		return {
			result: false,
		};
	}
}

export const SendVerificationEmail = ({ username, email }) => {
	try {
	} catch (err) {
		console.log(err);
	}
};
