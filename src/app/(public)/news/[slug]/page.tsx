import {
  NewsArticleRoute,
  generateNewsArticleMetadata,
  generateNewsStaticParams,
} from "@/features/news/pages/news-pages"

export const dynamicParams = true
export const generateStaticParams = generateNewsStaticParams
export const generateMetadata = generateNewsArticleMetadata
export default NewsArticleRoute
