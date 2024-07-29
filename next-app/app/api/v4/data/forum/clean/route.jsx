export async function POST() {
    // clear all posts that are older than 7 days

    const db = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data, error } = await db.from("forum_posts").select("*");
    if (error) {
        // deal with this
    }

    const now = new Date();
    const oldPosts = data.filter((post) => {
        const postDate = new Date(post.created_at);
        const diff = now - postDate;
        const diffInDays = diff / (1000 * 60 * 60 * 24);
        return diffInDays > 7;
    });

    // use "id" field to delete
    const ids = oldPosts.map((post) => post.id);
    const deletionResponse = await db
        .from("forum_posts")
        .delete()
        .in("id", ids);

    if (deletionResponse.error) {
        // deal with this
    }

    // return 201 with 'successfully deleted old posts'
    return new Response("successfully deleted old posts", {
        status: 201,
    });
}
