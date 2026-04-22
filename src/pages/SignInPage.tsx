import { SignIn } from "@clerk/react";
import { Users } from "lucide-react";
import { Link } from "../router";

export function SignInPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_90%_30%,rgba(6,182,212,0.2),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <header className="relative z-10 flex items-center justify-between px-10 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            GenZoo
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/app" className="text-gray-300 hover:text-blue-400 transition-colors">
            Explore Communities
          </Link>
          <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-300/80 mb-4">
              Welcome back
            </p>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Sign in to your
              <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                trusted community
              </span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Jump back into live rooms, follow breaking stories, and keep your
              reputation growing in the topics you care about.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-8 shadow-2xl shadow-blue-500/20">
            <SignIn routing="path" path="/signin" />
            <p className="text-xs text-gray-400 mt-6 text-center">
              By signing in you agree to the Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
