"use client"

import { Button } from "@/shared/ui/button"
import { FileUploadDropzone } from "@/shared/ui/file-upload-dropzone"
import { Field, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { useLeadSubmit } from "@/features/leads/ui/use-lead-submit"

export function CareerApplicationForm({ reference }: { reference?: string }) {
  const lead = useLeadSubmit()
  return (
    <>
    <form
      className="mt-3 space-y-2"
      onSubmit={(e) => {
        e.preventDefault()
        void lead.submit(e.currentTarget, { type: "career", reference: reference ?? "" })
      }}
    >
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <Field orientation="vertical">
        <FieldLabel htmlFor="career-apply-name" className="text-[10px] font-medium text-a7-black">
          Name
        </FieldLabel>
        <Input id="career-apply-name" name="name" required placeholder="Full Name" className="h-8 rounded-sm text-[11px]" />
      </Field>

      <Field orientation="vertical">
        <FieldLabel htmlFor="career-apply-email" className="text-[10px] font-medium text-a7-black">
          Email
        </FieldLabel>
        <Input id="career-apply-email" name="email" type="email" placeholder="Email" className="h-8 rounded-sm text-[11px]" />
      </Field>

      <Field orientation="vertical">
        <FieldLabel htmlFor="career-apply-phone" className="text-[10px] font-medium text-a7-black">
          Phone
        </FieldLabel>
        <Input id="career-apply-phone" name="phone" type="tel" placeholder="Phone" className="h-8 rounded-sm text-[11px]" />
      </Field>

      <Field orientation="vertical">
        <FieldLabel htmlFor="career-apply-cv" className="text-[10px] font-medium text-a7-black">
          Upload CV
        </FieldLabel>
        <FileUploadDropzone
          name="career-apply-cv"
          variant="career"
          title="Click here"
          description="to upload or drop files here"
          accept=".pdf,.doc,.docx"
          multiple={false}
          className="rounded-md"
        />
      </Field>

      <Field orientation="vertical">
        <FieldLabel htmlFor="career-apply-docs" className="text-[10px] font-medium text-a7-black">
          Additional Documents
        </FieldLabel>
        <FileUploadDropzone
          name="career-apply-docs-upload"
          variant="career"
          title="Click here"
          description="to upload or drop files here"
          multiple
          className="rounded-md"
        />
        <Textarea id="career-apply-docs" name="message" placeholder="Add links or notes" className="min-h-14 rounded-sm text-[11px]" />
      </Field>

      <Button type="submit" variant="default" shape="pill" className="h-8 w-full text-[10px] font-semibold" disabled={lead.pending || lead.done}>
        Submit Application
      </Button>
    </form>
    {lead.done || lead.error ? (
      <p role="status" className={lead.error ? "mt-2 text-center text-[10px] text-destructive" : "mt-2 text-center text-[10px] text-a7-text-gray"}>
        {lead.error ?? "Thank you — your application has been sent."}
      </p>
    ) : null}
    </>
  )
}
