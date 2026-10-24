"use client"

import { useState, useTransition } from "react"
import { KeyRound, Plus, Trash2 } from "lucide-react"

import type { Role } from "@/features/auth/core/domain/entity"
import {
  createUserAction,
  deleteUserAction,
  setUserPasswordAction,
  updateUserAction,
} from "@/features/users/services/user-actions"
import { Button } from "@/shared/ui/button"

export type AdminUserRow = {
  id: string
  name: string
  email: string
  role: Role
  isActive: boolean
  lastLoginAt: string | null
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

const ROLE_HELP: Record<Role, string> = {
  OWNER: "Everything, including managing users",
  ADMIN: "All content and settings",
  EDITOR: "Content only (no settings or users)",
}

function RoleSelect({ value, onChange }: { value: Role; onChange: (r: Role) => void }) {
  return (
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value as Role)}>
      {(["EDITOR", "ADMIN", "OWNER"] as Role[]).map((r) => (
        <option key={r} value={r}>{r.charAt(0) + r.slice(1).toLowerCase()} — {ROLE_HELP[r]}</option>
      ))}
    </select>
  )
}

function UserRow({ user, isSelf }: { user: AdminUserRow; isSelf: boolean }) {
  const [name, setName] = useState(user.name)
  const [role, setRole] = useState<Role>(user.role)
  const [active, setActive] = useState(user.isActive)
  const [pw, setPw] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [msg, setMsg] = useState("")
  const [pending, start] = useTransition()
  const dirty = name !== user.name || role !== user.role || active !== user.isActive

  return (
    <li className="rounded-xl border border-border bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Name</span>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Role</span>
          <RoleSelect value={role} onChange={setRole} />
        </label>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" className="size-4" checked={active} disabled={isSelf} onChange={(e) => setActive(e.target.checked)} />
          Active
        </label>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {user.email}
        {isSelf ? " · you" : ""} · last login {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "never"}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" disabled={!dirty || pending} onClick={() => start(async () => {
          const res = await updateUserAction({ id: user.id, name, role, isActive: active })
          setMsg(res.error ?? "Saved")
        })}>Save</Button>
        <Button type="button" size="sm" variant="outline" disabled={pending} onClick={() => setShowPw((v) => !v)}>
          <KeyRound className="size-4" /> Set password
        </Button>
        {!isSelf ? (
          <Button type="button" size="sm" variant="ghost" className="text-destructive" disabled={pending} onClick={() => {
            if (!confirm(`Remove ${user.email}? They will no longer be able to sign in.`)) return
            start(async () => {
              const res = await deleteUserAction(user.id)
              setMsg(res.error ?? "Removed")
            })
          }}>
            <Trash2 className="size-4" /> Remove
          </Button>
        ) : null}
        {msg ? <span className="text-xs text-muted-foreground">{msg}</span> : null}
      </div>
      {showPw ? (
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <label className="block flex-1">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">New password (min 12 characters)</span>
            <input type="password" autoComplete="new-password" className={inputCls} value={pw} onChange={(e) => setPw(e.target.value)} />
          </label>
          <Button type="button" size="sm" disabled={pending || pw.length < 12} onClick={() => start(async () => {
            const res = await setUserPasswordAction(user.id, pw)
            setMsg(res.error ?? "Password updated")
            if (!res.error) {
              setPw("")
              setShowPw(false)
            }
          })}>Update password</Button>
        </div>
      ) : null}
    </li>
  )
}

export function UsersManager({ users, currentUserId }: { users: AdminUserRow[]; currentUserId: string }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", role: "EDITOR" as Role, password: "" })
  const [msg, setMsg] = useState("")
  const [pending, start] = useTransition()

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">People who can sign in to this admin panel.</p>
        </div>
        <Button type="button" className="ml-auto" size="sm" onClick={() => setOpen((v) => !v)}>
          <Plus className="size-4" /> Add user
        </Button>
      </div>

      {open ? (
        <div className="mb-6 rounded-xl border border-border bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold">New user</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Name</span>
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Email</span>
              <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Role</span>
              <RoleSelect value={form.role} onChange={(role) => setForm({ ...form, role })} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Temporary password (min 12 characters)</span>
              <input type="password" autoComplete="new-password" className={inputCls} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button type="button" size="sm" disabled={pending} onClick={() => start(async () => {
              const res = await createUserAction(form)
              setMsg(res.error ?? "User added. Share the email and temporary password with them privately.")
              if (!res.error) {
                setForm({ name: "", email: "", role: "EDITOR", password: "" })
                setOpen(false)
              }
            })}>Create user</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      ) : null}
      {msg ? <p className="mb-4 text-sm text-muted-foreground">{msg}</p> : null}

      <ul className="space-y-3">
        {users.map((u) => (
          <UserRow key={`${u.id}-${u.role}-${u.isActive}-${u.name}`} user={u} isSelf={u.id === currentUserId} />
        ))}
      </ul>
    </div>
  )
}
