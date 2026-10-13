import { FurnishedLuxuryProperties } from "@/features/home/ui/home/furnished-luxury-properties"
import { TrustedDeveloperPartners } from "@/features/home/ui/home/trusted-developer-partners"
import { RealEstateExperts } from "@/features/home/ui/home/real-estate-experts"
import { HomeDeveloperCtaNewsletter } from "@/shared/ui/marketing/home-developer-cta-newsletter"
import { homeDeveloperCtaContent } from "@/features/developer/content/developer-cta-content"
import { HomeFaqSection } from "@/shared/ui/marketing/home-faq-section"
import { HappyHomeOwners } from "@/features/home/ui/home/happy-home-owners"
import { RealEstateNews } from "@/features/home/ui/home/real-estate-news"
import { RealEstatingSinceBanner } from "@/features/home/ui/home/real-estating-since-banner"
import { TrendingLuxuryVillas } from "@/features/home/ui/home/trending-luxury-villas"
import { HeroSection } from "@/features/home/ui/home/hero-section"
import { MostTrendingProjects } from "@/features/home/ui/home/most-trending-projects"
import { OffPlanLatestLaunches } from "@/features/home/ui/home/off-plan-latest-launches"
import { HOME_HERO_IMAGE_FALLBACK, HERO_SLIDE_IMAGES } from "@/shared/lib/constants/home.constants"
import { HOME_REAL_ESTATE_EXPERTS } from "@/features/home/content/home-real-estate-experts"
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
  ] = await Promise.all([
    fetchProperties(),
    fetchPropertyListings(),
    fetchTrendingLuxuryVillas(),
    getHomeTestimonials(),
    getHomeNewsPosts(),
    getHomeFaqItems(),
    getHeroSlideImages(),
    getHomePartners(),
  ])

  const heroImageUrls = heroImages ?? HERO_SLIDE_IMAGES

  return (
    <div>
      <HeroSection
        imageUrl={heroImageUrls[0] ?? HOME_HERO_IMAGE_FALLBACK}
        imageUrls={heroImageUrls}
        imageAlt="Dubai skyline — luxury living in Binghatti City"
        titleLine1="Luxury Living In"
        discoverMoreHref="#discover-main"
      />
      <OffPlanLatestLaunches properties={properties} sectionId="discover-main" />
      <MostTrendingProjects properties={properties.slice(0, 6)} />
      <TrustedDeveloperPartners partners={partners} />
      <FurnishedLuxuryProperties listings={listings} />
      <TrendingLuxuryVillas listings={trendingVillas} />
      <RealEstateExperts experts={HOME_REAL_ESTATE_EXPERTS} />
      <RealEstatingSinceBanner />
      <RealEstateNews posts={newsPosts} />
      <HappyHomeOwners testimonials={testimonials} />
      <HomeFaqSection items={faqItems} />
      <HomeDeveloperCtaNewsletter {...homeDeveloperCtaContent} />
    </div>
  )
}
