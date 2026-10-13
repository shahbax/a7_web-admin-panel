"use client"

import { useActionState, useEffect, useRef } from "react"
import { UploadCloud } from "lucide-react"

import {
  uploadMediaAction,
  type MediaActionState,
} from "@/features/media/services/media-actions"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Field, FieldContent, FieldLabel } from "@/shared/ui/field"

const initial: MediaActionState = {}

export function MediaUploader({ folders }: { folders: string[] }) {
  const [state, action, pending] = useActionState(uploadMediaAction, initial)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.ok) formRef.current?.reset()
  }, [state.ok])

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-xl border border-border bg-white p-5"
    >
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <UploadCloud className="size-4" /> Upload media
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Images, video (MP4/WebM) or PDF, up to 50&nbsp;MB. Alt text is required for images.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field orientation="vertical" className="sm:col-span-2">
          <FieldContent>
            <FieldLabel htmlFor="file">File</FieldLabel>
            <input
              id="file"
              name="file"
              type="file"
              required
              accept="image/*,video/mp4,video/webm,application/pdf"
              className="block w-full cursor-pointer rounded-md border border-input bg-background text-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-neutral-200"
            />
          </FieldContent>
        </Field>

        <Field orientation="vertical">
          <FieldContent>
            <FieldLabel htmlFor="alt">Alt text</FieldLabel>
            <Input id="alt" name="alt" placeholder="Describe the image" inputSize="md" radius="md" />
          </FieldContent>
        </Field>

        <Field orientation="vertical">
          <FieldContent>
            <FieldLabel htmlFor="folder">Folder (optional)</FieldLabel>
            <Input
              id="folder"
              name="folder"
              placeholder="e.g. projects/marina"
              inputSize="md"
              radius="md"
              list="media-folders"
            />
            <datalist id="media-folders">
              {folders.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </FieldContent>
        </Field>
      </div>

      {state.error ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="mt-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Uploading…" : "Upload"}
        </Button>
      </div>
    </form>
  )
}
