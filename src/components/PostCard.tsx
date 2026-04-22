import React, { useCallback } from "react";
import type { Post } from "../data/posts";
import { cn } from "../lib/utils";
import { Link } from "../router";
import { ChevronDown, ChevronUp, MessageSquare, Share2 } from "lucide-react";

interface PostCardProps {
  post: Post;
  index: number;
  onVote: (id: string, dir: "up" | "down" | "none") => void;
  voteState: "up" | "down" | "none";
  currentUpvotes: number;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

const SUBREDDIT_COLORS: Record<string, string> = {
  "r/programming": "#FF6314",
  "r/worldnews": "#0095EB",
  "r/science": "#46D160",
  "r/gaming": "#FF4500",
  "r/AskReddit": "#FF585B",
  "r/technology": "#7193FF",
  "r/movies": "#FFB000",
  "r/funny": "#FF66AC",
  "r/todayilearned": "#20B2AA",
  "r/tifu": "#CC69B8",
};

export const PostCard = React.memo(({
  post,
  index,
  onVote,
  voteState,
  currentUpvotes,
}: PostCardProps) => {
  const idx = index + 1;
  const color = SUBREDDIT_COLORS[post.subreddit] ?? "#FF4500";
  const initial = (post.subreddit || "r/genzoo").replace("r/", "").charAt(0).toUpperCase();

  const handleUpvote = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onVote(post.id, "up");
  }, [post.id, onVote]);

  const handleDownvote = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onVote(post.id, "down");
  }, [post.id, onVote]);

  return (
    <article
      className="flex w-full glass-panel rounded-2xl hover:border-foreground/30 hover:-translate-y-[2px] hover:shadow-lg transition-all duration-200 cursor-pointer group"
      data-ocid={`post.item.${idx}`}
    >
      <div className="flex flex-col items-center gap-1 py-3 px-1 sm:px-2 bg-muted/30 rounded-l-2xl w-12 sm:w-10 shrink-0">
        <button
          type="button"
          onClick={handleUpvote}
          className={cn(
            "vote-btn min-w-[44px] min-h-[44px] sm:w-7 sm:h-7 sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded hover:bg-upvote/15 transition-transform active:scale-125 focus:outline-none",
            voteState === "up"
              ? "text-upvote"
              : "text-muted-foreground hover:text-upvote",
          )}
          aria-label="Upvote"
          data-ocid={`post.upvote_button.${idx}`}
        >
          <ChevronUp className="w-6 h-6 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>
        <span
          className={cn(
            "text-xs font-bold leading-none tabular-nums",
            voteState === "up"
              ? "text-upvote"
              : voteState === "down"
                ? "text-downvote"
                : "text-muted-foreground",
          )}
        >
          {formatCount(currentUpvotes)}
        </span>
        <button
          type="button"
          onClick={handleDownvote}
          className={cn(
            "vote-btn min-w-[44px] min-h-[44px] sm:w-7 sm:h-7 sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded hover:bg-downvote/15 transition-transform active:scale-125 focus:outline-none",
            voteState === "down"
              ? "text-downvote"
              : "text-muted-foreground hover:text-downvote",
          )}
          aria-label="Downvote"
          data-ocid={`post.downvote_button.${idx}`}
        >
          <ChevronDown className="w-6 h-6 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 p-3 min-w-0">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground mb-1.5">
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
              style={{ backgroundColor: color }}
            >
              {initial}
            </div>
            <span className="font-semibold text-foreground hover:underline cursor-pointer">
              {post.subreddit}
            </span>
          </div>
          <span>-</span>
          <span>Posted by {post.author}</span>
          <span>-</span>
          <span>{post.timeAgo}</span>
        </div>

        <Link
          to="/post/$id"
          params={{ id: post.id }}
          className="block"
          data-ocid={`post.link.${idx}`}
        >
          <h2 className="font-semibold text-sm sm:text-base leading-snug text-foreground group-hover:text-reddit-orange transition-colors mb-1.5">
            {post.title}
          </h2>
        </Link>

        {post.flair && (
          <span
            className="inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-2"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {post.flair}
          </span>
        )}

        <div className="flex items-center gap-1 flex-wrap mt-1">
          <Link to="/post/$id" params={{ id: post.id }}>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95"
              data-ocid={`post.button.${idx}`}
            >
              <MessageSquare className="w-4 h-4" />
              {post.commentCount?.toLocaleString()} Comments
            </button>
          </Link>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95"
            data-ocid={`post.share_button.${idx}`}
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </article>
  );
});
