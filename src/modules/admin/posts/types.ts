export type PostStatus = "draft" | "published";

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  updated_at: string;
  published_at: string | null;
};

export type PostDetails = {
  title: string;
  slug: string;
  excerpt: string | null;
  status: PostStatus;
  content_html: string;
};

export type PostPayload = {
  title: string;
  slug: string;
  excerpt: string | null;
  status: PostStatus;
  content_html: string;
};
