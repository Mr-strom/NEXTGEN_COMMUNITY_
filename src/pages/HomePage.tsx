import React, { useEffect, useState, Suspense } from "react";

import { PostCard } from "../components/PostCard";
import { Sidebar } from "../components/Sidebar";
import { Skeleton } from "../components/ui/Skeleton";
import { fetchPosts, createPost, upvotePost } from "../lib/postsService";
import { cn } from "../lib/utils";
import { useVoteStore } from "../store/useVoteStore";
import { BarChart2, Flame, TrendingUp, Zap } from "lucide-react";

const LiveRoom = React.lazy(() => import("../components/LiveRoom"));

type SortTab = "hot" | "new" | "top" | "rising";
type Post = Awaited<ReturnType<typeof fetchPosts>>[number];

const SORT_TABS: { id: SortTab; label: string; icon: React.ReactNode }[] = [
  { id: "hot", label: "Hot", icon: <Flame className="w-4 h-4" /> },
  { id: "new", label: "New", icon: <Zap className="w-4 h-4" /> },
  { id: "top", label: "Top", icon: <BarChart2 className="w-4 h-4" /> },
  { id: "rising", label: "Rising", icon: <TrendingUp className="w-4 h-4" /> },
];

export function HomePage() {
  const [activeSort, setActiveSort] = useState<SortTab>("hot");
  const [mainTab, setMainTab] = useState<"Posts" | "Top" | "Live Room">("Posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const { votes, vote } = useVoteStore();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPosts();
        if (!cancelled) setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        if (!cancelled) setError("Failed to load feed. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    if (activeSort === "new") {
      return Number(b.id) - Number(a.id);
    }
    if (activeSort === "top") {
      return b.upvotes - a.upvotes;
    }
    if (activeSort === "rising") {
      return b.commentCount - a.commentCount;
    }
    return Number(a.id) - Number(b.id);
  });

  return (
    <main className="max-w-6xl mx-auto px-3 sm:px-4 py-6" data-ocid="home.page">
      <div className="mb-5 rounded-2xl border border-blue-500/20 bg-slate-950/40 backdrop-blur-xl px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300/80 mb-1">News pulse</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Track what the community trusts right now
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-200 border border-blue-400/30">
              24h verified: 128
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-200 border border-emerald-400/30">
              Live rooms: 34
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Feed */}
        <section className="flex-1 min-w-0">
          {/* Main Tab Bar */}
          <div className="flex border-b border-border/60 mb-4 text-sm w-full overflow-x-auto scrollbar-hide">
            {(["Posts", "Top", "Live Room"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setMainTab(tab);
                  if (tab === "Top") setActiveSort("top");
                  if (tab === "Posts" && activeSort === "top") setActiveSort("hot");
                }}
                className={cn(
                  "px-4 py-3 relative transition-all active:scale-95 whitespace-nowrap",
                  mainTab === tab
                    ? "text-white font-bold"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                {tab}
                {mainTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-md animate-in fade-in" />
                )}
              </button>
            ))}
          </div>

          {mainTab === "Live Room" ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Suspense
                fallback={
                  <div className="p-8 text-center text-muted-foreground">
                    <div className="animate-pulse w-8 h-8 rounded-full bg-muted mx-auto mb-2" />
                    Loading Live Room...
                  </div>
                }
              >
                <LiveRoom subredditName="genzoo" />
              </Suspense>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Create post form */}
              <div className="glass-panel rounded-2xl mb-3 p-3 sm:p-4">
                <h2 className="text-sm font-semibold mb-2 text-white">Create a post</h2>
                {createError && (
                  <p className="text-xs text-red-400 mb-2">{createError}</p>
                )}
                <form
                  className="flex flex-col gap-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!title.trim() || !body.trim()) {
                      setCreateError("Title and body are required.");
                      return;
                    }
                    setCreateError(null);
                    setCreating(true);
                    try {
                      const newPost = await createPost({
                        title: title.trim(),
                        content: body.trim(),
                      });
                      setPosts((prev) => [newPost, ...prev]);
                      setTitle("");
                      setBody("");
                    } catch (err: any) {
                      console.error("Failed to create post:", err);
                      setCreateError(`Error: ${err?.message || JSON.stringify(err)}`);
                    } finally {
                      setCreating(false);
                    }
                  }}
                >
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title"
                    className="w-full rounded-xl border border-input/70 bg-background/80 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  />
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Share something with GenZoo..."
                    className="w-full min-h-[90px] rounded-xl border border-input/70 bg-background/80 px-3 py-2 text-sm resize-vertical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={creating}
                      className="px-4 py-1.5 rounded-md text-sm font-semibold bg-reddit-orange hover:bg-reddit-orange-hover text-white disabled:opacity-60"
                    >
                      {creating ? "Posting..." : "Post"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Sort tabs */}
              <div className="glass-panel rounded-2xl mb-3 px-2 py-1 flex items-center gap-0.5">
                {SORT_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSort(tab.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-semibold transition-colors",
                      activeSort === tab.id
                        ? "bg-reddit-orange/10 text-reddit-orange"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                    )}
                    data-ocid="home.tab"
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Posts list */}
              <div className="flex flex-col gap-2" data-ocid="feed.list">
                {loading ? (
                  <div className="flex flex-col gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="glass-panel rounded-2xl flex p-3 gap-3">
                        <Skeleton className="w-10 h-20 shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-16 text-red-400 bg-red-500/10 rounded-2xl font-medium">
                    {error}
                    <button
                      onClick={() => window.location.reload()}
                      className="block mt-4 text-sm text-reddit-orange underline mx-auto"
                    >
                      Retry
                    </button>
                  </div>
                ) : sortedPosts.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground" data-ocid="feed.empty_state">
                    No posts found.
                  </div>
                ) : (
                  sortedPosts.map((post, index) => {
                    const voteData = votes[post.id];
                    const voteState = voteData?.dir ?? "none";
                    const currentUpvotes = voteData?.count ?? post.upvotes;

                    const handleVote = async (postId: string, dir: "up" | "down" | "none") => {
                      if (dir === "none") return;
                      const currentVote = votes[postId]?.dir;
                      let change = 0;

                      if (dir === "up") {
                        change = currentVote === "up" ? -1 : currentVote === "down" ? 2 : 1;
                      } else if (dir === "down") {
                        change = currentVote === "down" ? 1 : currentVote === "up" ? -2 : -1;
                      }

                      vote(postId, dir, post.upvotes);

                      try {
                        if (change !== 0) {
                          await upvotePost(postId, change);
                        }
                      } catch (e) {
                        console.error("Failed to upvote", e);
                      }
                    };

                    return (
                      <PostCard
                        key={post.id}
                        post={post}
                        index={index}
                        onVote={handleVote}
                        voteState={voteState}
                        currentUpvotes={currentUpvotes}
                      />
                    );
                  })
                )}
              </div>
            </div>
          )}
        </section>

        {/* Sidebar - hidden on mobile */}
        <div className="hidden lg:block w-72 shrink-0">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
