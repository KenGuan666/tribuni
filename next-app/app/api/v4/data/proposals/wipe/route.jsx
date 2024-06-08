import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
    try {

        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

        // delete all proposals
        await supabase.from("proposals").delete().neq("id", "");

        return Response.json({
            status: "success",
        }, { status: 201 });

    } catch (err) {
        console.log(err);
        return Response.json({
            status: "error",
        }, { status: 403 });
    }
}
