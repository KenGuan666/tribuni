import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
    const body = await req.json();
    const { id } = body;

    const supabaseClient = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data, error } = await supabaseClient
        .from("telegram_users")
        .select("*")
        .eq("id", id);
    if (!data || data.length == 0 || error) {
        return Response.json({
            code: 404,
            message: "User not found",
        });
    }

    const bookmarks = data[0].bookmarks;
    const proposals = [];
    for (const bookmark of bookmarks) {
        let { data, error } = await supabaseClient
            .from("proposals")
            .select("*")
            .eq("id", bookmark);

        if (data && data.length > 0 && !error) {
            const protocolResponse = await supabaseClient
                .from("protocols")
                .select("*")
                .eq("id", data[0].protocol);
            if (
                protocolResponse.data &&
                protocolResponse.data.length > 0 &&
                !protocolResponse.error
            ) {
                data[0]["protocolIcon"] = protocolResponse.data[0].icon;
            } else {
                data[0]["protocolIcon"] = "";
            }
            proposals.push(data[0]);
        }
    }

    return Response.json({
        code: 200,
        message: "Success",
        data: proposals,
    });
}
