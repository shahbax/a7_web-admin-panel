import "server-only"

import { listPublishedItems } from "@/features/cms/collections/core/repository"
import { HOME_NEWS_POSTS } from "@/features/home/content/home-news"

export type NewsArticle = {
  slug: string
  title: string
  excerpt: string
  cover: string
  date: string
  author: string
  body: string
}

function str(data: Record<string, unknown>, key: string) {
  const v = data[key]
  return typeof v === "string" ? v : ""
}

/** Published news posts from the admin; the original posts until any exist. */
export async function listNewsArticles(): Promise<NewsArticle[]> {
  try {
    const items = await listPublishedItems("news")
    if (items.length > 0) {
      return items
        .filter((it) => it.slug)
        .map((it) => ({
          slug: it.slug as string,
          title: str(it.data, "title") || it.title,
          excerpt: str(it.data, "excerpt"),
          cover: str(it.data, "cover"),
          date: str(it.data, "date"),
          author: str(it.data, "author"),
          body: str(it.data, "body"),
        }))
    }
  } catch {
    // Database unreachable: fall through to the original posts.
  }
  return HOME_NEWS_POSTS.map((p) => ({
    slug: p.id,
    title: p.title,
    excerpt: p.excerpt,
    cover: p.imageUrl,
    date: p.date,
    author: "",
    body: "",
  }))
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | undefined> {
  return (await listNewsArticles()).find((a) => a.slug === slug)
}

export function newsArticlePath(slug: string) {
  return `/news/${slug}`
}
