import { createClient } from "@supabase/supabase-js";

// supabase provides write access to database
// There's a duplicate definition of tableByProtocolId in the read database library: @/components/db/forum
var tableByProtocolId = {
    optimism: ["op_forum_topics", "op_forum_posts", "op_forum_categories"],
    compound: [
        "comp_forum_topics",
        "comp_forum_posts",
        "comp_forum_categories",
    ],
};

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

export async function upsertForumTopics(supabase, protocolId, topics) {
    const batchSize = 20;
    for (let i = 0; i < topics.length; i += batchSize) {
        let { err } = await upsertForumTopicsBatch(
            supabase,
            protocolId,
            topics.slice(i, i + batchSize),
        );
        if (err) {
            return err;
        }
    }
}

async function upsertForumTopicsBatch(supabase, protocolId, topics) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    return await supabase.from(topicTableName).upsert(topics, {
        onConflict: "id",
        ignoreDuplicates: false,
    });
}

export async function upsertForumPosts(supabase, protocolId, posts) {
    const batchSize = 20;
    for (let i = 0; i < posts.length; i += batchSize) {
        let { data, err } = await upsertForumPostsBatch(
            supabase,
            protocolId,
            posts.slice(i, i + batchSize),
        );
        if (err) {
            return err;
        }
    }
}

async function upsertForumPostsBatch(supabase, protocolId, posts) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    return await supabase.from(postTableName).upsert(posts, {
        onConflict: "id",
        ignoreDuplicates: false,
    });
}

export async function upsertForumCategories(supabase, protocolId, categories) {
    let [topicTableName, postTableName, categoryTableName] =
        tableByProtocolId[protocolId];
    categories = categories.map(({ id, name, color, text_color }) => ({
        id,
        name,
        color,
        text_color,
        font_size: 11,
    }));
    return await supabase.from(categoryTableName).upsert(categories, {
        onConflict: "id",
        ignoreDuplicates: false,
    });
}

export async function updateForumWeeklySummary(supabase, protocolId, summary) {
    return await supabase
        .from("fora")
        .update({
            forum_weekly_summary: summary,
            updated_at: new Date().toISOString(),
        })
        .eq("protocol_id", protocolId);
}
