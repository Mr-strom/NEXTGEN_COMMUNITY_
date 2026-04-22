import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/react";
import { LandingPage } from "./components/LandingPage";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { SignInPage } from "./pages/SignInPage";
import { Router, useRouter } from "./router";

function AppRoutes() {
  const { pathname } = useRouter();
  const { isSignedIn } = useUser();
  const postMatch = pathname.match(/^\/post\/([^/]+)$/);
  const postId = postMatch ? postMatch[1] : null;

  if (pathname === "/") {
    return <LandingPage />;
  }

  if (pathname === "/signin") {
    return <SignInPage />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(99,102,241,0.16),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="relative">
        <header className="border-b border-border/70 bg-card/70 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 h-10 flex items-center justify-end gap-2 text-xs">
            {!isSignedIn && (
              <>
                <SignInButton />
                <SignUpButton />
              </>
            )}
            {isSignedIn && <UserButton />}
          </div>
        </header>
        <Navbar />
        {postId !== null ? <PostDetailPage id={postId} /> : <HomePage />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
