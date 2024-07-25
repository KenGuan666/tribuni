import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function GET(req) {
    const _cookies = cookies();
    const url = new URL(req.url);
    const postIds = url.searchParams.get("postIds").split(",");

    const db = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data, error } = await db
        .from("forum_posts")
        .select("*")
        .in("id", postIds);

    if (error) {
        // return 500 with error
        return new Response(error, {
            status: 500,
        });
    }

    // return 200 with data
    return new Response(JSON.stringify(data), {
        status: 200,
    });
}
