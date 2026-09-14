import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = await getArticle((await params).slug).catch(() => null);
  return article ? { title: article.title, description: article.excerpt ?? undefined } : { title: "Article not found" };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle((await params).slug).catch(() => null);
  if (!article) notFound();
  return <article className="mx-auto max-w-3xl px-5 pb-24 pt-36 md:pt-44">
    <p className="font-mono text-[10px] uppercase tracking-[.28em] text-accent">APEX field notes · {new Date(article.publishedAt).toLocaleDateString()}</p>
    <h1 className="mt-6 font-display text-5xl leading-[.95] tracking-tight md:text-7xl">{article.title}</h1>
    {article.excerpt ? <p className="mt-8 text-xl leading-8 text-muted">{article.excerpt}</p> : null}
    <div className="mt-14 whitespace-pre-wrap border-t border-line pt-10 text-base leading-8 text-foreground/85">{article.content}</div>
  </article>;
}
