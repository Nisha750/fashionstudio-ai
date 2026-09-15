import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Account — VÉRA" },
      { name: "description", content: "Sign in to your VÉRA account to save looks and track orders." },
      { property: "og:title", content: "Account — VÉRA" },
      { property: "og:description", content: "Sign in to your VÉRA account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, signOut } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (user) {
    return (
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <p className="eyebrow">Account</p>
        <h1 className="display-lg mt-3">Welcome back.</h1>
        <p className="mt-4 text-sm text-muted-foreground">{user.email}</p>
        <button
          onClick={async () => {
            await signOut();
            toast("Signed out");
          }}
          className="mt-10 border px-8 py-4 text-[11px] uppercase tracking-[0.25em] hover:bg-accent"
        >
          Sign out
        </button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast("Check your email", { description: "Confirm your address to finish signing up." });
          return;
        }
        navigate({ to: "/" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast("Signed in");
        navigate({ to: "/" });
      }
    } catch (err) {
      toast("Something went wrong", { description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast("Google sign-in failed", { description: String(result.error) });
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <p className="eyebrow">Account</p>
      <h1 className="display-lg mt-3">{mode === "signin" ? "Sign in" : "Create account"}</h1>

      <form onSubmit={submit} className="mt-10 space-y-6">
        {mode === "signup" && (
          <div>
            <label className="eyebrow" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border-b bg-transparent pb-2 text-sm outline-none"
            />
          </div>
        )}
        <div>
          <label className="eyebrow" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border-b bg-transparent pb-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="eyebrow" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border-b bg-transparent pb-2 text-sm outline-none"
          />
        </div>
        <button
          disabled={busy}
          className="w-full bg-primary py-4 text-[11px] uppercase tracking-[0.25em] text-primary-foreground disabled:opacity-60"
        >
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        onClick={google}
        className="mt-4 w-full border py-4 text-[11px] uppercase tracking-[0.25em] hover:bg-accent"
      >
        Continue with Google
      </button>

      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-8 w-full text-[11px] uppercase tracking-[0.2em] text-muted-foreground underline"
      >
        {mode === "signin" ? "New to VÉRA? Create an account" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
