"use server";

import validator from "validator";
import { createUser } from "@/components/db/user";
import { getBot } from "@/components/bot";

export const RegisterUser = async ({ username, chatid }) => {
    console.log(`registering user ${username} with chatid ${chatid}`);
    try {
        let res = createUser(username, chatid);

        const postData = {
            message: {
                from: {
                    username: username,
                },
                chat: {
                    id: chatid,
                },
            },
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        };

        await fetch(`${process.env.SERVER_URL}/api/v4/bot`, options);

        return {
            code: 201,
            message: "Registration successful",
        };
    } catch (err) {
        console.log(err);
        return {
            code: 400,
            message: "Something Went Wrong!",
        };
    }
};
