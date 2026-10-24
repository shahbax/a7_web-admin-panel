import type { Metadata } from "next"

import { FurnishedLuxuryProperties } from "@/features/home/ui/home/furnished-luxury-properties"
import { TrustedDeveloperPartners } from "@/features/home/ui/home/trusted-developer-partners"
import { RealEstateExperts } from "@/features/home/ui/home/real-estate-experts"
import { HomeDeveloperCtaNewsletter } from "@/shared/ui/marketing/home-developer-cta-newsletter"
import { HomeFaqSection } from "@/shared/ui/marketing/home-faq-section"
import { HappyHomeOwners } from "@/features/home/ui/home/happy-home-owners"
import { RealEstateNews } from "@/features/home/ui/home/real-estate-news"
import { RealEstatingSinceBanner } from "@/features/home/ui/home/real-estating-since-banner"
import { TrendingLuxuryVillas } from "@/features/home/ui/home/trending-luxury-villas"
import { HeroSection } from "@/features/home/ui/home/hero-section"
import { MostTrendingProjects } from "@/features/home/ui/home/most-trending-projects"
import { OffPlanLatestLaunches } from "@/features/home/ui/home/off-plan-latest-launches"
import { HOME_HERO_IMAGE_FALLBACK, HERO_SLIDE_IMAGES } from "@/shared/lib/constants/home.constants"
import { renderSections } from "@/features/cms/site-content/core/sections"
import { loadHomeContent } from "@/features/home/services/home-page-content"
import { loadDeveloperCtaContent } from "@/features/home/services/shared-cta-content"
import {
  getHeroSlideImages,
  getHomeFaqItems,
  getHomeNewsPosts,
  getHomePartners,
  getHomeTestimonials,
} from "@/features/home/services/home-content-loader"
import {
  fetchProperties,
  fetchPropertyListings,
  fetchTrendingLuxuryVillas,
} from "@/features/property"

export async function generateHomeMetadata(): Promise<Metadata> {
  const { content } = await loadHomeContent()
  const metadata: Metadata = {}
  if (content.seo.title) metadata.title = content.seo.title
  if (content.seo.description) metadata.description = content.seo.description
  return metadata
}

export default async function HomePage() {
  const [
    properties,
    listings,
    trendingVillas,
    testimonials,
    newsPosts,
    faqItems,
    heroImages,
    partners,
    { content, layout },
    developerCta,
  ] = await Promise.all([
    fetchProperties(),
    fetchPropertyListings(),
    fetchTrendingLuxuryVillas(),
    getHomeTestimonials(),
    getHomeNewsPosts(),
    getHomeFaqItems(),
    getHeroSlideImages(),
    getHomePartners(),
    loadHomeContent(),
    loadDeveloperCtaContent(),
  ])

  const heroImageUrls = heroImages ?? HERO_SLIDE_IMAGES
  const { hero } = content
  const experts = content.experts.items.map((expert) => ({
    ...expert,
    whatsAppHref: expert.whatsAppHref || undefined,
  }))

  return (
    <div>
      {renderSections(layout, {
        hero: (
          <HeroSection
            imageUrl={heroImageUrls[0] ?? HOME_HERO_IMAGE_FALLBACK}
            imageUrls={heroImageUrls}
            imageAlt={hero.imageAlt}
            titleLine1={hero.titleLine1}
            titleLine2={hero.titleLine2}
            titleLine2Options={hero.titleLine2Options}
            subtitle={hero.subtitle}
            startingFromValue={hero.startingFromValue}
            startingFromLabel={hero.startingFromLabel}
            paymentPlanValue={hero.paymentPlanValue}
            paymentPlanLabel={hero.paymentPlanLabel}
            discoverMoreHref="#discover-main"
            discoverMoreLabel={hero.discoverMoreLabel}
            searchProps={{ placeholder: hero.searchPlaceholder, typeLabel: hero.searchTypeLabel }}
          />
        ),
        offPlanLaunches: (
          <OffPlanLatestLaunches
            properties={properties}
            sectionId="discover-main"
            title={content.offPlanLaunches.title}
            browseAllLabel={content.offPlanLaunches.browseAllLabel}
            browseAllHref={content.offPlanLaunches.browseAllHref}
          />
        ),
        trendingProjects: (
          <MostTrendingProjects
            properties={properties.slice(0, 6)}
            title={content.trendingProjects.title}
            viewAllLabel={content.trendingProjects.viewAllLabel}
            viewAllHref={content.trendingProjects.viewAllHref}
          />
        ),
        developerPartners: (
          <TrustedDeveloperPartners partners={partners} title={content.developerPartners.title} />
        ),
        furnishedLuxury: (
          <FurnishedLuxuryProperties listings={listings} title={content.furnishedLuxury.title} />
        ),
        trendingVillas: (
          <TrendingLuxuryVillas
            listings={trendingVillas}
            kicker={content.trendingVillas.kicker}
            title={content.trendingVillas.title}
            viewAllLabel={content.trendingVillas.ctaLabel}
            viewAllHref={content.trendingVillas.ctaHref}
          />
        ),
        experts: (
          <RealEstateExperts
            experts={experts}
            kicker={content.experts.kicker}
            title={content.experts.title}
          />
        ),
        brandStory: (
          <RealEstatingSinceBanner
            title={content.brandStory.title}
            imageUrl={content.brandStory.imageUrl}
            imageAlt={content.brandStory.imageAlt}
            videoHref={content.brandStory.videoHref || undefined}
          />
        ),
        news: (
          <RealEstateNews
            posts={newsPosts}
            title={content.news.title}
            viewAllLabel={content.news.viewAllLabel}
            viewAllHref={content.news.viewAllHref}
          />
        ),
        testimonials: (
          <HappyHomeOwners testimonials={testimonials} title={content.testimonials.title} />
        ),
        faq: <HomeFaqSection title={content.faq.title} items={faqItems} />,
        developerCta: <HomeDeveloperCtaNewsletter {...developerCta.home} />,
      })}
    </div>
  )
}
