// Client-safe lead types + labels (no server-only imports).

export type LeadDTO = {
  id: string
  type: string
  name: string | null
  email: string | null
  phone: string | null
  message: string | null
  sourceUrl: string | null
  reference: string | null
  payload: Record<string, unknown> | null
  handled: boolean
  createdAt: string
}

export const LEAD_TYPE_LABELS: Record<string, string> = {
  newsletter: "Newsletter",
  contact: "Contact",
  sell: "Sell / list property",
  inquiry: "Property inquiry",
  career: "Career application",
  "area-expert": "Ask an area expert",
  agent: "Agent contact",
}
