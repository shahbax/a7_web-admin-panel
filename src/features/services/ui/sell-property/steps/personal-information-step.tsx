"use client"

import { Mail, Phone, User } from "lucide-react"

import { Field, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import type { SellPropertyFormContent } from "@/features/services/core/sell-property-content"
import { useSellFormValues } from "@/features/services/ui/sell-property/form-values"

export function PersonalInformationStep({ content }: { content: SellPropertyFormContent["personal"] }) {
  const { values } = useSellFormValues()
  return (
    <div className="mt-7 space-y-4">
      <h2 className="text-xl font-semibold leading-tight text-a7-text-gray sm:text-[26px]">
        {content.heading}
      </h2>
      <Field orientation="vertical">
        <FieldLabel htmlFor="sp-full-name">{content.fullName.label}</FieldLabel>
        <Input id="sp-full-name" name="name" autoComplete="name" defaultValue={values["sp-full-name"]} radius="lg" placeholder={content.fullName.placeholder} icon={<User className="size-4" />} iconPosition="start" />
      </Field>
      <Field orientation="vertical">
        <FieldLabel htmlFor="sp-email">{content.email.label}</FieldLabel>
        <Input id="sp-email" name="email" type="email" autoComplete="email" defaultValue={values["sp-email"]} radius="lg" placeholder={content.email.placeholder} icon={<Mail className="size-4" />} iconPosition="start" />
      </Field>
      <Field orientation="vertical">
        <FieldLabel htmlFor="sp-mobile">{content.mobile.label}</FieldLabel>
        <Input id="sp-mobile" name="phone" type="tel" autoComplete="tel" defaultValue={values["sp-mobile"]} radius="lg" placeholder={content.mobile.placeholder} icon={<Phone className="size-4" />} iconPosition="start" />
      </Field>
    </div>
  )
}
