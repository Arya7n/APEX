"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";

export function AuthForm({ mode, admin = false }: { mode: "login" | "register"; admin?: boolean }) {
  const router = useRouter(); const action = useAuthStore((s) => mode === "login" ? s.login : s.register);
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setLoading(true); const form = new FormData(event.currentTarget);
    try {
      if (mode === "login") await (action as (e: string, p: string) => Promise<void>)(String(form.get("email")), String(form.get("password")));
      else await (action as (e: string, p: string, n: string) => Promise<void>)(String(form.get("email")), String(form.get("password")), String(form.get("name")));
      const user = useAuthStore.getState().user;
      if (admin && user?.role !== "admin") { await useAuthStore.getState().logout(); throw new Error("This account does not have administrator access."); }
      router.push(admin ? "/admin" : "/garage");
    } catch (e) { setError(e instanceof Error ? e.message : "Authentication failed"); } finally { setLoading(false); }
  };
  return <main className="mx-auto max-w-md px-5 pb-24 pt-36"><p className="font-mono text-xs uppercase tracking-[.28em] text-accent">{admin ? "Admin terminal" : "Private archive"}</p><h1 className="mt-5 font-display text-5xl">{mode === "login" ? "Sign in." : "Create account."}</h1><form onSubmit={submit} className="mt-10 space-y-4">{mode === "register" ? <input required name="name" placeholder="Name" className="w-full border border-line bg-surface p-4 outline-none focus:border-accent" /> : null}<input required type="email" name="email" placeholder="Email" className="w-full border border-line bg-surface p-4 outline-none focus:border-accent" /><input required minLength={8} type="password" name="password" placeholder="Password (8+ characters)" className="w-full border border-line bg-surface p-4 outline-none focus:border-accent" />{error ? <p className="text-sm text-accent">{error}</p> : null}<button disabled={loading} className="w-full bg-accent p-4 font-mono text-xs uppercase tracking-widest disabled:opacity-50">{loading ? "Authenticating…" : mode === "login" ? "Sign in" : "Register"}</button></form>{!admin ? <p className="mt-6 text-sm text-muted">{mode === "login" ? <>New to APEX? <Link href="/register" className="text-foreground">Register</Link></> : <>Already registered? <Link href="/login" className="text-foreground">Sign in</Link></>}</p> : null}</main>;
}
