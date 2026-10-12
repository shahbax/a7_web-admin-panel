"use client"

import { useActionState } from "react"

import type { SettingKey } from "@/features/cms/settings/schemas"
import type { SettingVersionSummary } from "@/features/cms/settings/service"
import {
  restoreSettingVersionAction,
  type SettingsActionState,
} from "@/features/cms/settings/services/settings-actions"
import { Button } from "@/shared/ui/button"

const initial: SettingsActionState = {}

export function VersionHistory({
  settingKey,
  versions,
}: {
  settingKey: SettingKey
  versions: SettingVersionSummary[]
}) {
  const [state, action] = useActionState(restoreSettingVersionAction, initial)

  if (versions.length === 0) {
    return <p className="text-sm text-muted-foreground">No saved versions yet.</p>
  }

  return (
    <div className="space-y-2">
      {state.ok ? <p className="text-sm text-[#1B5E3B]">Version restored.</p> : null}
      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <ul className="divide-y divide-border rounded-lg border border-border bg-white">
        {versions.map((v, i) => (
          <li key={v.id} className="flex items-center justify-between gap-3 px-3 py-2">
            <span className="text-sm text-muted-foreground">
              {i === 0 ? "Current · " : ""}
              {new Date(v.createdAt).toLocaleString()}
            </span>
            {i === 0 ? null : (
              <form action={action}>
                <input type="hidden" name="key" value={settingKey} />
                <input type="hidden" name="versionId" value={v.id} />
                <Button type="submit" size="sm" variant="outline">
                  Restore
                </Button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
