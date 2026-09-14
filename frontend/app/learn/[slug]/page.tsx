import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const article = await getArticle((await params).slug).catch(() => null);
  return article
    ? { title: article.title, description: article.excerpt ?? undefined }
    : { title: "Article not found" };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = await getArticle((await params).slug).catch(() => null);
  if (!article) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-32 sm:pt-36 md:pt-44">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
        APEX field notes · {new Date(article.publishedAt).toLocaleDateString()}
      </p>
      <h1 className="mt-6 break-words font-display text-4xl leading-[0.95] tracking-tight sm:text-5xl md:text-7xl">
        {article.title}
      </h1>
      {article.excerpt ? (
        <p className="mt-6 text-lg leading-8 text-muted sm:mt-8 sm:text-xl">{article.excerpt}</p>
      ) : null}
      <div className="mt-10 whitespace-pre-wrap break-words border-t border-line pt-8 text-base leading-8 text-foreground/85 sm:mt-14 sm:pt-10">
        {article.content}
      </div>
    </article>
  );
}
