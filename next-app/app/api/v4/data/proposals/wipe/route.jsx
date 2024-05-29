import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
    try {

        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

        // delete all proposals
        await supabase.from("proposals").delete().neq("id", "");

        return Response.json({
            code: 201,
            status: "success",
        });

    } catch (err) {
        console.log(err);
        return Response.json({
            code: 403,
            status: "error",
        });
    }
}
