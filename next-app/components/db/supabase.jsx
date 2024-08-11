import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
}

export async function saveUsers(supabase, users) {
    const res = await supabase.from("telegram_users").upsert(users, {
        onConflict: "id",
        ignoreDuplicates: false,
    });
    return res.error;
}

export async function upsertProtocolsData(supabase, protocolsData) {
    const batchSize = 20;
    for (let i = 0; i < protocolsData.length; i += batchSize) {
        let { err } = upsertProtocolsDataBatch(
            supabase,
            protocolsData.slice(i, i + batchSize),
        );
        if (err) {
            return err;
        }
    }
}

async function upsertProtocolsDataBatch(supabase, protocolsData) {
    return await supabase.from("protocols").upsert(
        protocolsData.map((d) => ({
            id: d.cname,
            name: d.name,
            icon: d.icons ? d.icons[0].url : "",
        })),
        {
            onConflict: "id",
            ignoreDuplicates: false,
        },
    );
}

export async function upsertProposalData(supabase, proposalsData) {
    const batchSize = 20;
    for (let i = 0; i < proposalsData.length; i += batchSize) {
        let { err } = upsertProposalDataBatch(
            supabase,
            proposalsData.slice(i, i + batchSize),
        );
        if (err) {
            return err;
        }
    }
}

async function upsertProposalDataBatch(supabase, proposalsData) {
    return await supabase.from("proposals").upsert(
        proposalsData.map(
            ({
                id,
                protocol,
                proposer,
                title,
                starttime,
                endtime,
                url,
                raw_summary,
                summary,
                proposal_class,
                was_summarized,
                choices,
                results,
            }) => ({
                id,
                protocol,
                proposer,
                title,
                starttime,
                endtime,
                url,
                raw_summary,
                summary,
                proposal_class,
                was_summarized,
                choices,
                results,
            }),
        ),
        {
            onConflict: "id",
            ignoreDuplicates: false,
        },
    );
}

export async function upsertOpForumTopics(supabase, topics) {
    const batchSize = 20;
    for (let i = 0; i < topics.length; i += batchSize) {
        let { err } = upsertOpForumTopicsBatch(
            supabase,
            topics.slice(i, i + batchSize),
        );
        if (err) {
            return err;
        }
    }
}

async function upsertOpForumTopicsBatch(supabase, topics) {
    return await supabase.from("op_forum_topics").upsert(topics, {
        onConflict: "id",
        ignoreDuplicates: false,
    });
}

export async function upsertOpForumPosts(supabase, posts) {
    const batchSize = 20;
    for (let i = 0; i < posts.length; i += batchSize) {
        let { err } = upsertOpForumPostsBatch(
            supabase,
            posts.slice(i, i + batchSize),
        );
        if (err) {
            return err;
        }
    }
}

async function upsertOpForumPostsBatch(supabase, posts) {
    return await supabase.from("op_forum_posts").upsert(posts, {
        onConflict: "id",
        ignoreDuplicates: false,
    });
}

export async function upsertOPForumCategories(supabase, categories) {
    categories = categories.map(({ id, name, color, text_color }) => ({
        id,
        name,
        color,
        text_color,
        font_size: 11,
    }));
    return await supabase.from("op_forum_categories").upsert(categories, {
        onConflict: "id",
        ignoreDuplicates: false,
    });
}

export async function updateOpForumWeeklySummary(supabase, summary) {
    return await supabase
        .from("fora")
        .update({
            forum_weekly_summary: summary,
            updated_at: new Date().toISOString(),
        })
        .eq("id", 1);
}
