import "server-only"

import { listPublishedItems } from "@/features/cms/collections/core/repository"
import {
  HOME_TESTIMONIALS,
  type HomeTestimonial,
} from "@/features/home/content/home-testimonials"
import {
  HOME_NEWS_POSTS,
  type HomeNewsPost,
} from "@/features/home/content/home-news"

function str(data: Record<string, unknown>, key: string): string {
  const v = data[key]
  return typeof v === "string" ? v : ""
}

/**
 * Testimonials for the home page: published CMS testimonials if any exist,
 * otherwise the original hard-coded content (keeps the page pixel-identical
 * until the team adds their own).
 */
export async function getHomeTestimonials(): Promise<readonly HomeTestimonial[]> {
  try {
    const items = await listPublishedItems("testimonials")
    if (items.length === 0) return HOME_TESTIMONIALS
    return items.map((it) => ({
      id: it.id,
      name: str(it.data, "name") || it.title,
      role: str(it.data, "role"),
      quote: str(it.data, "quote"),
      avatarUrl: str(it.data, "avatar"),
    }))
  } catch {
    return HOME_TESTIMONIALS
  }
}

/** News posts for the home page: published CMS posts, else original content. */
export async function getHomeNewsPosts(): Promise<readonly HomeNewsPost[]> {
  try {
    const items = await listPublishedItems("news")
    if (items.length === 0) return HOME_NEWS_POSTS
    return items.map((it, i) => ({
      id: it.id,
      title: str(it.data, "title") || it.title,
      excerpt: str(it.data, "excerpt"),
      imageUrl: str(it.data, "cover"),
      date: str(it.data, "date"),
      views: 0,
      href: it.slug ? `/${it.slug}` : "#",
      featured: i === 0,
    }))
  } catch {
    return HOME_NEWS_POSTS
  }
}
