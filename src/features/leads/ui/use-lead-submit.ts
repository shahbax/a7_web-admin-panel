"use client"

import { useState } from "react"

type LeadSubmitState = {
  pending: boolean
  done: boolean
  error: string | null
}

/**
 * Submits an existing public form to the lead pipeline via /api/leads without
 * changing the form's markup. Maps the common `fullName` field to `name`.
 */
export function useLeadSubmit() {
  const [state, setState] = useState<LeadSubmitState>({ pending: false, done: false, error: null })

  async function submit(form: HTMLFormElement, extra: Record<string, string> = {}) {
    setState({ pending: true, done: false, error: null })
    const fd = new FormData(form)
    if (fd.get("fullName") && !fd.get("name")) fd.set("name", String(fd.get("fullName")))
    for (const [k, v] of Object.entries(extra)) fd.set(k, v)
    if (!fd.get("sourceUrl") && typeof window !== "undefined") {
      fd.set("sourceUrl", window.location.pathname)
    }
    try {
      const res = await fetch("/api/leads", { method: "POST", body: fd })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok || json.error) {
        setState({ pending: false, done: false, error: json.error || "Something went wrong. Please try again." })
      } else {
        setState({ pending: false, done: true, error: null })
      }
    } catch {
      setState({ pending: false, done: false, error: "Network error. Please try again." })
    }
  }

  return { ...state, submit }
}
