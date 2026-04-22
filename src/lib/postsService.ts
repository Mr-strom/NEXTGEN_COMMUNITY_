import { getSupabase } from "./supabase";
import type { Post, Comment } from "../data/posts";
import { POSTS, COMMENTS } from "../data/posts";

/** Supabase table names. See .env.example or Supabase SQL Editor for schema. */
const POSTS_TABLE = "posts";
const COMMENTS_TABLE = "comments";

export interface NewPostInput {
  title: string;
  content: string;
  subreddit?: string;
  author?: string;
}

export interface NewCommentInput {
  postId: string;
  body: string;
  author?: string;
  parentId?: string;
}

/** Fetch all posts: from Supabase if configured and table exists, else mock data. */
export async function fetchPosts(): Promise<Post[]> {
  const client = getSupabase();
  if (!client) return POSTS;

  const { data, error } = await client
    .from(POSTS_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return POSTS;
  }

  const rows = data as unknown as Record<string, unknown>[];
  return rows.map((row) => mapRowToPost(row));
}

/** Fetch a single post by id. */
export async function fetchPostById(id: string): Promise<Post | null> {
  const client = getSupabase();
  if (!client) {
    return POSTS.find((p) => p.id === id) ?? null;
  }

  const { data, error } = await client
    .from(POSTS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return POSTS.find((p) => p.id === id) ?? null;
  }

  return mapRowToPost(data as Record<string, unknown>);
}

/** Fetch comments for a post. */
export async function fetchCommentsByPostId(
  postId: string
): Promise<Comment[]> {
  const client = getSupabase();
  if (!client) {
    return COMMENTS[postId] ?? [];
  }

  const { data, error } = await client
    .from(COMMENTS_TABLE)
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return COMMENTS[postId] ?? [];
  }

  const rows = data as unknown as Record<string, unknown>[];
  return rows.map((row) => mapRowToComment(row));
}

/** Create a new post. Uses Supabase when configured; otherwise returns a local-only post. */
export async function createPost(input: NewPostInput): Promise<Post> {
  const client = getSupabase();

  const base = {
    title: input.title,
    content: input.content,
    subreddit: input.subreddit ?? "r/genzoo",
    author: input.author ?? "u/guest",
    time_ago: "just now",
    upvotes: 0,
    comment_count: 0,
  };

  // If Supabase is not configured, create an in-memory post (not persisted)
  if (!client) {
    const fallback: Post = {
      id: String(Date.now()),
      title: base.title,
      content: base.content,
      subreddit: base.subreddit,
      author: base.author,
      timeAgo: base.time_ago,
      upvotes: 0,
      commentCount: 0,
      flair: undefined,
      imageUrl: undefined,
    };
    return fallback;
  }

  const { data, error } = await client
    .from(POSTS_TABLE)
    .insert(base)
    .select("*")
    .single();

  if (error || !data) {
    throw error ?? new Error("Failed to create post");
  }

  return mapRowToPost(data as Record<string, unknown>);
}

/** Create a new comment. Uses Supabase when configured. */
export async function createComment(input: NewCommentInput): Promise<Comment> {
  const client = getSupabase();

  const base = {
    post_id: input.postId,
    body: input.body,
    author: input.author ?? "u/guest",
    parent_id: input.parentId,
    time_ago: "just now",
    upvotes: 0,
  };

  if (!client) {
    const fallback: Comment = {
      id: String(Date.now()),
      author: base.author,
      timeAgo: base.time_ago,
      upvotes: 0,
      body: base.body,
    };
    return fallback;
  }

  const { data, error } = await client
    .from(COMMENTS_TABLE)
    .insert(base)
    .select("*")
    .single();

  if (error || !data) {
    throw error ?? new Error("Failed to create comment");
  }

  try {
    // Only increment comment count if it's a top level comment, or if we want replies to count as well
    await client.rpc('increment_comment_count', { row_id: input.postId });
  } catch(e) {
    console.warn("Failed to increment comment count", e);
  }

  return mapRowToComment(data as Record<string, unknown>);
}

/** Upvote a post. Returns the new upvote count. */
export async function upvotePost(id: string, amount: number = 1): Promise<void> {
  const client = getSupabase();
  if (!client) return;
  
  const { data: post } = await client
    .from(POSTS_TABLE)
    .select("upvotes")
    .eq("id", id)
    .single();

  if (post) {
    await client
      .from(POSTS_TABLE)
      .update({ upvotes: Number(post.upvotes) + amount })
      .eq("id", id);
  }
}

function mapRowToPost(row: Record<string, unknown>): Post {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? ""),
    subreddit: String(row.subreddit ?? "r/genzoo"),
    author: String(row.author ?? "u/unknown"),
    timeAgo: String(row.time_ago ?? row.timeAgo ?? "now"),
    upvotes: Number(row.upvotes ?? 0),
    commentCount: Number(row.comment_count ?? row.commentCount ?? 0),
    content: String(row.content ?? ""),
    flair: row.flair != null ? String(row.flair) : undefined,
    imageUrl: row.image_url != null ? String(row.image_url) : row.imageUrl != null ? String(row.imageUrl) : undefined,
  };
}

function mapRowToComment(row: Record<string, unknown>): Comment {
  return {
    id: String(row.id ?? ""),
    author: String(row.author ?? ""),
    timeAgo: String(row.time_ago ?? row.timeAgo ?? "now"),
    upvotes: Number(row.upvotes ?? 0),
    body: String(row.body ?? ""),
    parentId: row.parent_id ? String(row.parent_id) : undefined,
    replies: Array.isArray(row.replies)
      ? (row.replies as Record<string, unknown>[]).map(mapRowToComment)
      : undefined,
  };
}
