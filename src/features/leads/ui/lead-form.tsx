"use client"

import { useActionState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

import { submitLeadAction, type LeadFormState } from "@/features/leads/services/lead-actions"

export type LeadFormField = {
  name: "name" | "email" | "phone" | "message"
  label: string
  type?: "text" | "email" | "tel" | "textarea"
  required?: boolean
  placeholder?: string
}

const initial: LeadFormState = {}

/**
 * Reusable public lead form. Drop it into any page/section with the fields it
 * needs; it saves to the DB, emails a notification and (later) creates a
 * Bitrix lead. Includes a honeypot and inherits the page URL as the source.
 */
export function LeadForm({
  type,
  fields,
  reference,
  submitLabel = "Submit",
  successMessage = "Thank you — we’ll be in touch shortly.",
  className,
}: {
  type: string
  fields: LeadFormField[]
  reference?: string
  submitLabel?: string
  successMessage?: string
  className?: string
}) {
  const [state, action, pending] = useActionState(submitLeadAction, initial)
  const pathname = usePathname()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.ok) formRef.current?.reset()
  }, [state.ok])

  if (state.ok) {
    return <p className={className}>{successMessage}</p>
  }

  return (
    <form ref={formRef} action={action} className={className}>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="sourceUrl" value={pathname} />
      {reference ? <input type="hidden" name="reference" value={reference} /> : null}
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="space-y-3">
        {fields.map((f) =>
          f.type === "textarea" ? (
            <textarea
              key={f.name}
              name={f.name}
              required={f.required}
              placeholder={f.placeholder ?? f.label}
              aria-label={f.label}
              rows={4}
              className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          ) : (
            <input
              key={f.name}
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              placeholder={f.placeholder ?? f.label}
              aria-label={f.label}
              className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          ),
        )}
      </div>

      {state.error ? <p className="mt-2 text-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:brightness-95 disabled:opacity-50"
      >
        {pending ? "Sending…" : submitLabel}
      </button>
    </form>
  )
}
