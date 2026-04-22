import { motion } from "motion/react";
import {
  MessageSquare,
  ArrowRight,
  MessageCircle,
  BadgeCheck,
  Lightbulb,
  Newspaper,
  Award,
  Users
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "../router";

export function LandingPage() {
  const { navigate } = useRouter();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: MessageSquare,
      title: "Community Posts & Discussions",
      description:
        "Join topic-based communities called subreddits. Read, write, and vote on posts. Upvote good content so the best stuff rises to the top. Nested comment threads let conversations go as deep as they need to."
    },
    {
      icon: MessageCircle,
      title: "Live Chat Rooms",
      description:
        "Every community has a live room -- a real-time WhatsApp-style chatroom attached to every subreddit. When something big is happening, jump in and react with your community instantly. No refreshing, no waiting."
    },
    {
      icon: BadgeCheck,
      title: "AI Credibility Layer",
      description:
        "Every post gets an AI-powered credibility badge -- Verified, Disputed, Opinion, or Unverified -- assigned automatically by analyzing the claim against real news sources. You always know what you're reading."
    },
    {
      icon: Lightbulb,
      title: "Plain Language Explainer",
      description:
        "See a headline you don't understand? Hit the \"Explain This\" button. Our AI breaks down any news story or post into 5 clear sentences written for anyone -- no background knowledge needed."
    },
    {
      icon: Newspaper,
      title: "Current Affairs Hub",
      description:
        "A dedicated space for news and current events. See how any story developed over time with a visual timeline. Read the same story from multiple perspectives side by side -- without the echo chamber."
    },
    {
      icon: Award,
      title: "Topic Reputation System",
      description:
        "Your credibility grows in the topics you contribute to. Regular, accurate, helpful posts in a community earn you a Trusted Voice badge in that topic. Reputation is earned by quality, not just popularity."
    }
  ];

  const floatingOrbs = [
    { size: 420, x: "10%", y: "20%", delay: 0, color: "rgba(59, 130, 246, 0.75)" },
    { size: 320, x: "80%", y: "60%", delay: 2, color: "rgba(99, 102, 241, 0.6)" },
    { size: 360, x: "60%", y: "10%", delay: 4, color: "rgba(6, 182, 212, 0.55)" },
    { size: 220, x: "30%", y: "70%", delay: 1.5, color: "rgba(16, 185, 129, 0.35)" },
    { size: 300, x: "90%", y: "15%", delay: 3, color: "rgba(14, 165, 233, 0.6)" }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {floatingOrbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{
            duration: 20,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-12 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            GenZoo
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-8"
        >
          <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">
            Features
          </a>
          <a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors">
            About
          </a>
          <button
            className="text-gray-300 hover:text-blue-400 transition-colors"
            onClick={() => navigate("/app")}
          >
            Communities
          </button>
          <button
            className="px-6 py-2 rounded-full bg-blue-600/20 border border-blue-500/50 text-blue-300 hover:bg-blue-600/30 transition-all backdrop-blur-sm"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
        </motion.div>
      </nav>

      <div id="about" className="relative z-10 flex flex-col items-center justify-center px-12 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm mb-8"
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-300">The internet's most trusted community platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-7xl font-bold text-center mb-6 max-w-5xl"
        >
          <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Where Real Discussion Meets
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Real-Time Conversation
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-400 text-center mb-12 max-w-4xl leading-relaxed"
        >
          GenZoo is a reimagined discussion platform built for the way people actually talk today.
          It combines the depth of Reddit-style community threads with live WhatsApp-style chat rooms,
          an AI-powered credibility layer that tells you what to trust, and a current affairs hub that
          shows every side of every story. Built for people who want real conversation, not just a feed
          to scroll.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center gap-6"
        >
          <button
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold overflow-hidden shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all"
            onClick={() => navigate("/signin")}
          >
            <span className="relative z-10 flex items-center gap-2">
              Join GenZoo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold backdrop-blur-sm hover:bg-white/10 transition-all"
            onClick={() => navigate("/app")}
          >
            Explore Communities
          </button>
        </motion.div>
      </div>

      <div id="features" className="relative z-10 px-12 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Everything You Need for Better Conversations
            </span>
          </h2>
          <p className="text-gray-400 text-center mb-16 text-lg">
            Powerful features that make GenZoo the most trusted community platform
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-950/30 to-slate-900/30 border border-blue-500/20 backdrop-blur-xl hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

                <div className="relative z-10">
                  <motion.div
                    animate={{
                      scale: hoveredFeature === index ? 1.1 : 1,
                      rotate: hoveredFeature === index ? 5 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mb-6"
                  >
                    <feature.icon className="w-7 h-7 text-blue-400" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>

                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div id="communities" className="relative z-10 px-12 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-3xl" />

          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-blue-950/50 to-slate-900/50 border border-blue-500/30 backdrop-blur-xl text-center">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Ready to Join the Conversation?
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of communities having real discussions right now. Your voice matters.
            </p>
            <button
              className="group relative px-10 py-5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-lg overflow-hidden shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all"
              onClick={() => navigate("/signin")}
            >
              <span className="relative z-10 flex items-center gap-2">
                Create Your Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <p className="text-sm text-gray-500 mt-6">Free forever - No credit card required</p>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 border-t border-blue-500/10 px-12 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-gray-500 text-sm">
          <div>(c) 2026 GenZoo. All rights reserved.</div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-blue-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
