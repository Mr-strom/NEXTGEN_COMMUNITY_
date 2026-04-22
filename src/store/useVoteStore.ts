import { create } from "zustand";
import { persist } from "zustand/middleware";

type VoteDir = "up" | "down" | "none";

interface VoteState {
  votes: Record<string, { dir: VoteDir; count: number }>;
  vote: (postId: string, dir: VoteDir, originalCount: number) => void;
  getVote: (postId: string) => { dir: VoteDir; count: number } | null;
}

export const useVoteStore = create<VoteState>()(
  persist(
    (set, get) => ({
      votes: {},

      vote: (postId, newDir, originalCount) => {
        set((state) => {
          const current = state.votes[postId];
          const currentDir = current?.dir ?? "none";

          let count: number;
          let finalDir: VoteDir;

          if (newDir === currentDir) {
            // Toggle off — return to neutral
            finalDir = "none";
            count = originalCount;
          } else {
            finalDir = newDir;
            if (currentDir === "none") {
              count = newDir === "up" ? originalCount + 1 : originalCount - 1;
            } else if (currentDir === "up" && newDir === "down") {
              count = originalCount - 1;
            } else if (currentDir === "down" && newDir === "up") {
              count = originalCount + 1;
            } else {
              count = originalCount;
            }
          }

          return {
            votes: {
              ...state.votes,
              [postId]: { dir: finalDir, count },
            },
          };
        });
      },

      getVote: (postId) => {
        return get().votes[postId] ?? null;
      },
    }),
    {
      name: "vote-storage", // local storage key
    }
  )
);
