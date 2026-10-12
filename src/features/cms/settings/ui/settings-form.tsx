"use client"

import { useActionState } from "react"

import type { SettingsActionState } from "@/features/cms/settings/services/settings-actions"
import { Button } from "@/shared/ui/button"

const initial: SettingsActionState = {}

type Action = (
  prev: SettingsActionState,
  form: FormData,
) => Promise<SettingsActionState>

export function SettingsForm({
  action,
  children,
  submitLabel = "Save changes",
}: {
  action: Action
  children: React.ReactNode
  submitLabel?: string
}) {
  const [state, formAction, pending] = useActionState(action, initial)

  return (
    <form action={formAction} className="space-y-5">
      {children}
      <div className="flex items-center gap-3 border-t border-border pt-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
        {state.ok ? <span className="text-sm text-[#1B5E3B]">Saved and published.</span> : null}
        {state.error ? <span className="text-sm text-destructive">{state.error}</span> : null}
      </div>
    </form>
  )
}

export function TextField({
  label,
  name,
  defaultValue,
  placeholder,
  help,
  type = "text",
}: {
  label: string
  name: string
  defaultValue?: string
  placeholder?: string
  help?: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {help ? <span className="mt-1 block text-xs text-muted-foreground">{help}</span> : null}
    </label>
  )
}

export function TextArea({
  label,
  name,
  defaultValue,
  placeholder,
  rows = 3,
}: {
  label: string
  name: string
  defaultValue?: string
  placeholder?: string
  rows?: number
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  )
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
  help,
}: {
  label: string
  name: string
  defaultChecked?: boolean
  help?: string
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 rounded border-input"
      />
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {help ? <span className="block text-xs text-muted-foreground">{help}</span> : null}
      </span>
    </label>
  )
}
