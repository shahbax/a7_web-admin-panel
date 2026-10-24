"use client"

import { useState, useTransition } from "react"

import { changeOwnPasswordAction } from "@/features/users/services/user-actions"
import { Button } from "@/shared/ui/button"

const inputCls =
  "w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function AccountForm({ name, email, role }: { name: string; email: string; role: string }) {
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [repeat, setRepeat] = useState("")
  const [msg, setMsg] = useState("")
  const [pending, start] = useTransition()

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">My account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {name} · {email} · {role.toLowerCase()}
      </p>
      <div className="mt-6 space-y-3 rounded-xl border border-border bg-white p-5">
        <h2 className="text-sm font-semibold">Change password</h2>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Current password</span>
          <input type="password" autoComplete="current-password" className={inputCls} value={current} onChange={(e) => setCurrent(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">New password (min 12 characters)</span>
          <input type="password" autoComplete="new-password" className={inputCls} value={next} onChange={(e) => setNext(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Repeat new password</span>
          <input type="password" autoComplete="new-password" className={inputCls} value={repeat} onChange={(e) => setRepeat(e.target.value)} />
        </label>
        <div className="flex items-center gap-3">
          <Button type="button" size="sm" disabled={pending} onClick={() => {
            if (next !== repeat) return setMsg("The new passwords don't match.")
            start(async () => {
              const res = await changeOwnPasswordAction(current, next)
              setMsg(res.error ?? "Password changed.")
              if (!res.error) {
                setCurrent("")
                setNext("")
                setRepeat("")
              }
            })
          }}>Change password</Button>
          {msg ? <span className="text-xs text-muted-foreground">{msg}</span> : null}
        </div>
      </div>
    </div>
  )
}
