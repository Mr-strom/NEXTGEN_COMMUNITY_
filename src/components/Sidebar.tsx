import { Button } from "./ui/button";
import { Plus, Star, Radio, TrendingUp } from "lucide-react";

interface Community {
  name: string;
  members: string;
  color: string;
  description: string;
}

const COMMUNITIES: Community[] = [
  {
    name: "r/programming",
    members: "6.2M",
    color: "#FF6314",
    description: "Computer programming",
  },
  {
    name: "r/worldnews",
    members: "31.4M",
    color: "#0095EB",
    description: "World news and events",
  },
  {
    name: "r/science",
    members: "32.1M",
    color: "#46D160",
    description: "Science and research",
  },
  {
    name: "r/gaming",
    members: "40.7M",
    color: "#FF4500",
    description: "Gaming community",
  },
  {
    name: "r/AskReddit",
    members: "44.3M",
    color: "#FF585B",
    description: "Questions and answers",
  },
  {
    name: "r/technology",
    members: "16.8M",
    color: "#7193FF",
    description: "Technology news",
  },
  {
    name: "r/movies",
    members: "30.2M",
    color: "#FFB000",
    description: "Film and cinema",
  },
  {
    name: "r/funny",
    members: "56.9M",
    color: "#FF66AC",
    description: "Funny and humorous content",
  },
];

const NEWS_PULSES = [
  { title: "Climate policy debate spikes", tag: "Verified", impact: "+18%" },
  { title: "Tech layoffs tracker updated", tag: "Disputed", impact: "+7%" },
  { title: "Elections live room open", tag: "Live", impact: "+42%" },
];

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-3" data-ocid="sidebar.section">
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-3 py-2.5 border-b border-border/70">
          <h3 className="font-bold text-sm text-foreground">
            Popular Communities
          </h3>
        </div>
        <div className="py-1">
          {COMMUNITIES.map((community, i) => (
            <button
              key={community.name}
              type="button"
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted/40 transition-colors text-left"
              data-ocid={`sidebar.item.${i + 1}`}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: community.color }}
              >
                {community.name.replace("r/", "").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {community.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {community.members} members
                </p>
              </div>
            </button>
          ))}
        </div>
        <div className="px-3 py-2.5 border-t border-border/70">
          <Button
            className="w-full h-8 text-sm font-semibold bg-reddit-orange hover:bg-reddit-orange-hover text-white border-0"
            data-ocid="sidebar.section"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Community
          </Button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-glow-cyan">
            <Radio className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-bold text-sm text-foreground">News Radar</h3>
        </div>
        <div className="flex flex-col gap-2">
          {NEWS_PULSES.map((pulse, index) => (
            <div key={index} className="flex items-start justify-between gap-2 text-xs">
              <div className="min-w-0">
                <p className="text-foreground font-semibold truncate">{pulse.title}</p>
                <span className="text-muted-foreground">{pulse.tag}</span>
              </div>
              <span className="text-emerald-300 font-semibold">{pulse.impact}</span>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="mt-3 w-full h-8 text-xs font-semibold border-cyan-400 text-cyan-300 hover:bg-cyan-500/10 dark:border-cyan-400 dark:text-cyan-300 dark:hover:bg-cyan-500/20"
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          Open News Hub
        </Button>
      </div>

      <div className="glass-panel rounded-2xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-glow-cyan">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
          <h3 className="font-bold text-sm text-foreground">Genzoo Premium</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          The best Genzoo experience, with monthly Coins and more.
        </p>
        <Button
          variant="outline"
          className="w-full h-8 text-xs font-semibold border-cyan-400 text-cyan-300 hover:bg-cyan-500/10 dark:border-cyan-400 dark:text-cyan-300 dark:hover:bg-cyan-500/20"
        >
          Try Now
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center px-2">
        (c) {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Built with love using caffeine.ai
        </a>
      </p>
    </aside>
  );
}
