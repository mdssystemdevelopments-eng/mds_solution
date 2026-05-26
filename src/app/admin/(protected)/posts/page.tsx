import { PostsAdmin } from "@/components/admin/posts/posts-admin";
import { SupabaseRequired } from "@/components/admin/supabase-required";

export default function AdminPostsPage() {
  return (
    <SupabaseRequired>
      <PostsAdmin />
    </SupabaseRequired>
  );
}

