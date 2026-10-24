import "server-only"

import { getPageContent } from "@/features/cms/site-content/service"
import type {
  ConveyancingPageContent,
  ListYourPropertyPageContent,
  MortgagesPageContent,
  PlotsPageContent,
  PropertyManagementPageContent,
  PropertySnaggingPageContent,
  ServicesPageContent,
  ShortTermRentalsPageContent,
} from "@/features/services/content/cms-content"
import type { SellPropertyPageContent } from "@/features/services/content/cms-sell-property"

export type {
  ConveyancingPageContent,
  ListYourPropertyPageContent,
  MortgagesPageContent,
  PlotsPageContent,
  PropertyManagementPageContent,
  PropertySnaggingPageContent,
  SellPropertyPageContent,
  ServicesPageContent,
  ShortTermRentalsPageContent,
}

/** Admin-edited content (published, or draft in preview) over the code defaults. */
export const loadServicesContent = () => getPageContent<ServicesPageContent>("page.services")
export const loadConveyancingContent = () => getPageContent<ConveyancingPageContent>("page.services.conveyancing")
export const loadMortgagesContent = () => getPageContent<MortgagesPageContent>("page.services.mortgages")
export const loadPlotsContent = () => getPageContent<PlotsPageContent>("page.services.plots")
export const loadPropertyManagementContent = () =>
  getPageContent<PropertyManagementPageContent>("page.services.property-management")
export const loadPropertySnaggingContent = () =>
  getPageContent<PropertySnaggingPageContent>("page.services.property-snagging")
export const loadShortTermRentalsContent = () =>
  getPageContent<ShortTermRentalsPageContent>("page.services.short-term-rentals")
export const loadListYourPropertyContent = () =>
  getPageContent<ListYourPropertyPageContent>("page.services.list-your-property")
export const loadSellPropertyContent = () => getPageContent<SellPropertyPageContent>("page.sell-property")
