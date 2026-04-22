import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { useVoteStore } from "../store/useVoteStore";
import { Link } from "../router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Share2,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { type Post, type Comment } from "../data/posts";
import { fetchPostById, fetchCommentsByPostId, createComment, upvotePost } from "../lib/postsService";
import { Skeleton } from "../components/ui/Skeleton";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

const AVATAR_COLORS = [
  "#FF4500",
  "#FF6314",
  "#0095EB",
  "#46D160",
  "#7193FF",
  "#FF585B",
  "#FFB000",
  "#FF66AC",
  "#20B2AA",
  "#CC69B8",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface CommentItemProps {
  comment: Comment;
  index: number;
  depth?: number;
  onReply: (parentId: string, body: string) => Promise<void>;
}

const CommentItem = React.memo(function CommentItem({ comment, index, depth = 0, onReply }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initial = (comment.author || "u/guest").replace("u/", "").charAt(0).toUpperCase();
  const avatarColor = getAvatarColor(comment.author || "u/guest");

  return (
    <div
      className={cn(
        "flex gap-2.5 sm:gap-3 flex-col sm:flex-row",
        depth > 0 && "ml-4 sm:ml-6 pl-2 sm:pl-3 border-l-2 border-border/70",
      )}
      data-ocid={`comment.item.${index}`}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
        style={{ backgroundColor: avatarColor }}
      >
        {initial}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
          <span className="text-sm font-semibold text-foreground">
            {comment.author}
          </span>
          <span className="text-xs text-muted-foreground">
            {comment.timeAgo}
          </span>
        </div>
        <p className="text-sm text-foreground leading-relaxed mb-1.5">
          {comment.body}
        </p>

        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="vote-btn min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:w-6 sm:h-6 flex items-center justify-center rounded text-muted-foreground hover:text-upvote hover:bg-upvote/10 transition-transform active:scale-125 focus:outline-none"
            >
              <ChevronUp className="w-5 h-5 sm:w-4 sm:h-4" strokeWidth={2.5} />
            </button>
            <span className="text-xs font-bold text-muted-foreground tabular-nums px-0.5">
              {formatCount(comment.upvotes)}
            </span>
            <button
              type="button"
              className="vote-btn min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:w-6 sm:h-6 flex items-center justify-center rounded text-muted-foreground hover:text-downvote hover:bg-downvote/10 transition-transform active:scale-125 focus:outline-none"
            >
              <ChevronDown className="w-5 h-5 sm:w-4 sm:h-4" strokeWidth={2.5} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsReplying(!isReplying)}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted px-2 py-1 rounded transition-colors"
          >
            Reply
          </button>
        </div>

        {isReplying && (
          <div className="mb-3 flex flex-col gap-2">
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder={`Reply to ${comment.author}...`}
              disabled={isSubmitting}
              className="min-h-[80px] text-sm flex w-full rounded-md border border-input bg-background/80 px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={async () => {
                  if (!replyBody.trim()) return;
                  setIsSubmitting(true);
                  try {
                    await onReply(comment.id, replyBody);
                    setReplyBody("");
                    setIsReplying(false);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting || !replyBody.trim()}
                className="h-7 text-xs bg-reddit-orange hover:bg-reddit-orange-hover text-white border-0"
              >
                {isSubmitting ? "Replying..." : "Reply"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => setIsReplying(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="flex flex-col gap-3">
            {comment.replies.map((reply, i) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                index={i + 1}
                depth={depth + 1}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

interface PostDetailPageProps {
  id: string;
}

export function PostDetailPage({ id }: PostDetailPageProps) {
  const { votes, vote } = useVoteStore();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [fetchedPost, fetchedComments] = await Promise.all([
          fetchPostById(id),
          fetchCommentsByPostId(id)
        ]);
        if (!cancelled) {
          setPost(fetchedPost);
          setComments(fetchedComments);
        }
      } catch (err) {
        console.error("Failed to load post data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleVote = useCallback(async (postId: string, dir: "up" | "down") => {
    const currentVote = votes[postId]?.dir;
    let change = 0;

    if (dir === "up") {
      change = currentVote === "up" ? -1 : currentVote === "down" ? 2 : 1;
    } else if (dir === "down") {
      change = currentVote === "down" ? 1 : currentVote === "up" ? -2 : -1;
    }

    vote(postId, dir, post?.upvotes ?? 0);

    try {
      if (change !== 0) {
        await upvotePost(postId, change);
      }
    } catch (e) {
      console.error("Failed to upvote", e);
    }
  }, [votes, vote, post]);

  const handleCommentSubmit = useCallback(async () => {
    if (!commentBody.trim()) return;
    setIsSubmitting(true);
    try {
      const newComment = await createComment({ postId: id, body: commentBody });
      setComments((prev) => [...prev, newComment]);
      setCommentBody("");
      setPost((p) => p ? { ...p, commentCount: p.commentCount + 1 } : null);
    } catch (err) {
      console.error("Failed to create comment", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [commentBody, id]);

  const handleReply = useCallback(async (parentId: string, body: string) => {
    try {
      await createComment({ postId: id, parentId, body });
      const fetchedComments = await fetchCommentsByPostId(id);
      setComments(fetchedComments);
      setPost((p) => p ? { ...p, commentCount: p.commentCount + 1 } : null);
    } catch (err) {
      console.error("Failed to create reply", err);
    }
  }, [id]);

  const voteData = post ? votes[post.id] : null;
  const voteState = voteData?.dir ?? "none";
  const currentUpvotes = voteData?.count ?? post?.upvotes ?? 0;

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-1/4 mb-6" />
        <div className="glass-panel rounded-2xl flex p-4 gap-4 mb-6">
          <Skeleton className="w-10 h-32 shrink-0" />
          <div className="flex-1 space-y-4 py-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 items-start pt-4 border-t border-border">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Post not found</h2>
        <Link to="/">
          <Button variant="ghost" className="text-reddit-orange">
            Back to feed
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-3 sm:px-4 py-6">
      <Link to="/">
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          data-ocid="post.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to feed
        </button>
      </Link>

      <article className="glass-panel rounded-2xl overflow-hidden mb-4">
        <div className="flex">
          <div className="flex flex-col items-center gap-1 py-3 px-1 sm:px-2 bg-muted/30 w-12 sm:w-10 shrink-0">
            <button
              type="button"
              onClick={() => handleVote(post.id, "up")}
              className={cn(
                "vote-btn min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:w-7 sm:h-7 flex items-center justify-center rounded hover:bg-upvote/15 transition-transform active:scale-125 focus:outline-none",
                voteState === "up"
                  ? "text-upvote"
                  : "text-muted-foreground hover:text-upvote",
              )}
              aria-label="Upvote"
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
              onClick={() => handleVote(post.id, "down")}
              className={cn(
                "vote-btn min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:w-7 sm:h-7 flex items-center justify-center rounded hover:bg-downvote/15 transition-transform active:scale-125 focus:outline-none",
                voteState === "down"
                  ? "text-downvote"
                  : "text-muted-foreground hover:text-downvote",
              )}
              aria-label="Downvote"
            >
              <ChevronDown className="w-6 h-6 sm:w-5 sm:h-5" strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex-1 p-4 min-w-0">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground mb-2">
              <span className="font-semibold text-foreground">
                {post.subreddit}
              </span>
              <span>-</span>
              <span>Posted by {post.author}</span>
              <span>-</span>
              <span>{post.timeAgo}</span>
            </div>

            <h1 className="font-bold text-xl leading-snug text-foreground mb-2">
              {post.title}
            </h1>

            {post.flair && (
              <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-3 bg-reddit-orange/15 text-reddit-orange">
                {post.flair}
              </span>
            )}

            <p className="text-sm text-foreground leading-relaxed mb-4">
              {post.content}
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {post.commentCount.toLocaleString()} Comments
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </article>

      <div className="glass-panel rounded-2xl p-4 mb-4">
        <p className="text-sm text-muted-foreground mb-2">
          Comment as{" "}
          <span className="text-reddit-orange font-semibold">u/guest</span>
        </p>
        <textarea
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          placeholder="What are your thoughts?"
          className="min-h-[100px] text-sm mb-3 resize-none flex w-full rounded-md border border-input bg-background/80 px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          data-ocid="comment.textarea"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleCommentSubmit}
            disabled={isSubmitting || !commentBody.trim()}
            className="h-8 px-5 text-sm font-semibold bg-reddit-orange hover:bg-reddit-orange-hover text-white border-0"
            data-ocid="comment.submit_button"
          >
            {isSubmitting ? "Posting..." : "Comment"}
          </Button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-bold text-sm text-foreground">
            {post.commentCount.toLocaleString()} Comments
          </h2>
        </div>

        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {comments.map((comment, index) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                index={index + 1}
                depth={0}
                onReply={handleReply}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
