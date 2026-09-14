import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { getArticles } from "@/lib/api";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Learn",
};

export default async function LearnPage() {
  const articles = await getArticles().catch(() => []);
  return (
    <>
      <PageHeader
        index="06"
        label="Learn"
        title="The language of machines."
        description="Horsepower, torque, winglets, ride-by-wire — editorial, not a wiki dump."
      />
      <section className="grid gap-px bg-line px-5 pb-24 md:mx-10 md:grid-cols-2 md:px-0">
        {articles.map((article, index) => <Link key={article.slug} href={`/learn/${article.slug}`} className="group bg-surface p-7 md:p-10"><span className="font-mono text-[10px] tracking-widest text-accent">{String(index + 1).padStart(2, "0")}</span><h2 className="mt-8 font-display text-3xl group-hover:text-accent">{article.title}</h2><p className="mt-4 leading-7 text-muted">{article.excerpt}</p><p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-muted">{new Date(article.publishedAt).toLocaleDateString()}</p></Link>)}
        {!articles.length ? <p className="bg-surface p-10 text-muted">No articles have been published yet.</p> : null}
      </section>
    </>
  );
}
