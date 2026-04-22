export interface Post {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  timeAgo: string;
  upvotes: number;
  commentCount: number;
  content: string;
  flair?: string;
  imageUrl?: string;
}

export interface Comment {
  id: string;
  author: string;
  timeAgo: string;
  upvotes: number;
  body: string;
  parentId?: string;
  replies?: Comment[];
}

export const POSTS: Post[] = [
  {
    id: "1",
    title: "Welcome to Genzoo",
    subreddit: "r/genzoo",
    author: "u/genzoo_admin",
    timeAgo: "just now",
    upvotes: 42,
    commentCount: 3,
    content:
      "This is your first post. Once you wire Supabase writes, new posts created from the UI will show up here alongside this sample content.",
    flair: "Announcement",
  },
  {
    id: "2",
    title: "Show HN: My first Supabase-backed feed",
    subreddit: "r/programming",
    author: "u/you",
    timeAgo: "5 min ago",
    upvotes: 27,
    commentCount: 1,
    content:
      "Genzoo is now powered by Supabase for reading posts. Next step: add create-post and comments that write to the database.",
    flair: "Project",
  },
];

export const COMMENTS: Record<string, Comment[]> = {
  "1": [
    {
      id: "c1",
      author: "u/genzoo_bot",
      timeAgo: "just now",
      upvotes: 10,
      body: "Try editing this data in src/data/posts.ts or replace it entirely with Supabase content.",
    },
  ],
  "2": [
    {
      id: "c2",
      author: "u/supabase_fan",
      timeAgo: "2 min ago",
      upvotes: 5,
      body: "Nice setup! Remember to keep your anon key in .env and never commit service role keys.",
    },
  ],
};
