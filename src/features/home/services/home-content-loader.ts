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

/**
 * FAQ items for the home page from published CMS FAQs (group "home" or
 * "global" or blank). Returns undefined when none exist so the section keeps
 * its original default items.
 */
export async function getHomeFaqItems(): Promise<{ title: string; content: string }[] | undefined> {
  try {
    const items = await listPublishedItems("faqs")
    const scoped = items.filter((it) => {
      const g = str(it.data, "group").toLowerCase()
      return g === "" || g === "home" || g === "global"
    })
    if (scoped.length === 0) return undefined
    return scoped.map((it) => ({
      title: str(it.data, "question") || it.title,
      content: str(it.data, "answer"),
    }))
  } catch {
    return undefined
  }
}

/** Hero background images from published hero slides, else undefined (defaults). */
export async function getHeroSlideImages(): Promise<string[] | undefined> {
  try {
    const items = await listPublishedItems("heroSlides")
    const images = items.map((it) => str(it.data, "image")).filter(Boolean)
    return images.length ? images : undefined
  } catch {
    return undefined
  }
}

/** Developer partner logos from published CMS items, else undefined (defaults). */
export async function getHomePartners(): Promise<{ name: string; logo: string }[] | undefined> {
  try {
    const items = await listPublishedItems("partnerLogos")
    const partners = items
      .map((it) => ({ name: str(it.data, "name") || it.title, logo: str(it.data, "logo") }))
      .filter((p) => p.logo)
    return partners.length ? partners : undefined
  } catch {
    return undefined
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
      href: it.slug ? `/news/${it.slug}` : "/news",
      featured: i === 0,
    }))
  } catch {
    return HOME_NEWS_POSTS
  }
}
