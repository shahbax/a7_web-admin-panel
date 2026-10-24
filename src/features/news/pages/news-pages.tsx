import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlockRenderer } from "@/features/cms/blocks/block-renderer"
import type { Block } from "@/features/cms/blocks/types"
import {
  getNewsArticle,
  listNewsArticles,
  newsArticlePath,
} from "@/features/news/services/news"

function block(id: string, type: string, props: Record<string, unknown>): Block {
  return { id, type, props, visible: true }
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export const newsListMetadata: Metadata = {
  title: "News & insights",
  description: "Dubai property market news, guides and insights from A7 Group.",
}

export async function NewsListRoute() {
  const articles = await listNewsArticles()
  const blocks: Block[] = [
    block("heading", "generic.sectionHeading", {
      eyebrow: "News & insights",
      heading: "Latest from the Dubai property market",
      description: "Guides, market updates and advice from the A7 Group team.",
      align: "center",
      background: "white",
    }),
    block("posts", "generic.cardGrid", {
      heading: "",
      background: "white",
      cards: articles.map((a) => ({
        image: a.cover,
        title: a.title,
        text: [a.date, a.excerpt].filter(Boolean).join(" — "),
        href: newsArticlePath(a.slug),
      })),
    }),
  ]
  return (
    <main>
      <BlockRenderer blocks={blocks} />
    </main>
  )
}

export async function generateNewsStaticParams() {
  return (await listNewsArticles()).map((a) => ({ slug: a.slug }))
}

export async function generateNewsArticleMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const article = await getNewsArticle((await params).slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, images: article.cover ? [article.cover] : undefined },
  }
}

export async function NewsArticleRoute({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getNewsArticle((await params).slug)
  if (!article) notFound()
  const meta = [article.date, article.author].filter(Boolean).join(" · ")
  const blocks: Block[] = [
    block("heading", "generic.sectionHeading", {
      eyebrow: meta || "News",
      heading: article.title,
      description: article.excerpt,
      align: "center",
      background: "white",
    }),
  ]
  if (article.cover) {
    blocks.push(block("cover", "generic.image", { src: article.cover, alt: article.title, caption: "", background: "white" }))
  }
  blocks.push(
    block("body", "generic.richText", {
      html: article.body || `<p>${escapeHtml(article.excerpt)}</p>`,
      background: "white",
    }),
    block("more", "generic.buttons", {
      align: "center",
      background: "white",
      buttons: [{ label: "More news", href: "/news", variant: "outline" }],
    }),
  )
  return (
    <main>
      <BlockRenderer blocks={blocks} />
    </main>
  )
}
