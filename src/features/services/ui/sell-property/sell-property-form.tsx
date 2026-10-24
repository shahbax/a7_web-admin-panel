"use client"

import Image from "next/image"
import { Fragment, useCallback, useMemo, useState } from "react"

import { PersonalInformationStep } from "@/features/services/ui/sell-property/steps/personal-information-step"
import { PropertySpecificationsStep } from "@/features/services/ui/sell-property/steps/property-specifications-step"
import { VerificationMediaStep } from "@/features/services/ui/sell-property/steps/verification-media-step"
import { SELL_PROPERTY_STEP_ORDER, type SellPropertyStepKey } from "@/features/services/ui/sell-property/types"
import {
  SELL_PROPERTY_FORM_DEFAULTS,
  type SellPropertyFormContent,
} from "@/features/services/core/sell-property-content"
import { Button } from "@/shared/ui/button"
import { WizardStepNav } from "@/shared/ui/wizard-step-nav"
import { useMounted } from "@/shared/hooks/use-mounted"
import { SellFormValuesProvider, type SellFormValues } from "@/features/services/ui/sell-property/form-values"

export type SellPropertyFormProps = {
  /** CMS content; defaults to the built-in copy. */
  content?: SellPropertyFormContent
}

export function SellPropertyForm({ content = SELL_PROPERTY_FORM_DEFAULTS }: SellPropertyFormProps) {
  const wizardSteps = SELL_PROPERTY_STEP_ORDER.map((key) => ({
    key,
    lines: [content.steps[key].line1, content.steps[key].line2] as [string, string],
  }))
  const mounted = useMounted()
  const [activeStep, setActiveStep] = useState<SellPropertyStepKey>("details")
  const activeIndex = SELL_PROPERTY_STEP_ORDER.indexOf(activeStep)

  const isDetails = activeStep === "details"
  const isMedia = activeStep === "media"
  const isSubmit = activeStep === "submit"
  const isStepCompletedOrActive = (step: SellPropertyStepKey) => SELL_PROPERTY_STEP_ORDER.indexOf(step) <= activeIndex

  const [values, setValues] = useState<SellFormValues>({})
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [error, setError] = useState("")
  const setValue = useCallback((key: string, value: string) => setValues((v) => ({ ...v, [key]: value })), [])
  const valuesContext = useMemo(() => ({ values, setValue }), [values, setValue])

  // Text inputs are uncontrolled; capture what is typed so it survives step changes.
  const captureInput = (event: React.FormEvent<HTMLDivElement>) => {
    const target = event.target as HTMLInputElement
    if (target.id?.startsWith("sp-")) setValue(target.id, target.value)
  }

  const optionLabel = (options: readonly { value: string; label: string }[], value?: string) =>
    options.find((o) => o.value === value)?.label ?? value ?? ""

  const submit = async () => {
    if (!values["sp-email"] && !values["sp-mobile"]) {
      setError("Please add your email or mobile number in step 1.")
      setStatus("error")
      return
    }
    setStatus("sending")
    setError("")
    const details = [
      ["Purpose", values.propertyFor ?? "rent"],
      ["Location", optionLabel(content.property.location.options, values["sp-location-select"])],
      ["Property type", optionLabel(content.property.propertyType.options, values["sp-property-type"])],
      ["Bedrooms", optionLabel(content.property.bed.options, values["sp-bed"])],
      ["Size", values["sp-size"] ?? ""],
      ["Unit number", values["sp-unit"] ?? ""],
      ["Asking price", values["sp-price"] ?? ""],
    ].filter(([, v]) => v)
    const fd = new FormData()
    fd.set("type", "sell")
    fd.set("name", values["sp-full-name"] ?? "")
    fd.set("email", values["sp-email"] ?? "")
    fd.set("phone", values["sp-mobile"] ?? "")
    fd.set("message", details.map(([k, v]) => `${k}: ${v}`).join("\n"))
    fd.set("sourceUrl", window.location.pathname)
    try {
      const res = await fetch("/api/leads", { method: "POST", body: fd })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok || json.error) throw new Error(json.error || "Something went wrong. Please try again.")
      setStatus("sent")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  const goNext = () => {
    if (isDetails) setActiveStep("media")
    else if (isMedia) setActiveStep("submit")
  }

  const goBack = () => {
    if (isSubmit) setActiveStep("media")
    else if (isMedia) setActiveStep("details")
  }

  return (
    <SellFormValuesProvider value={valuesContext}>
    <div className="mx-auto w-full max-w-[574px] bg-white px-4 py-6 sm:px-6 sm:py-7 lg:px-9 lg:py-9" onChange={captureInput}>
      <Image
        src="/assets/brand/logo.svg"
        alt={content.logoAlt}
        width={140}
        height={36}
        className="mx-auto h-7 w-auto sm:h-8"
      />

      <h1 className="mt-4 text-center font-heading text-[clamp(1.875rem,7.5vw,3.75rem)] leading-[0.95] font-semibold tracking-tight text-black">
        {content.titleLines.map((line, index) => (
          <Fragment key={index}>
            {index > 0 ? <br /> : null}
            {line}
          </Fragment>
        ))}
      </h1>

      <WizardStepNav
        className="mt-6"
        steps={wizardSteps}
        activeStep={activeStep}
        onStepChange={setActiveStep}
        isStepCompletedOrActive={isStepCompletedOrActive}
      />

      {!mounted ? (
        <div className="mt-7 space-y-4" aria-hidden>
          <div className="h-8 w-2/3 rounded-md bg-[#F3F4F6]" />
          <div className="h-11 w-full rounded-lg bg-[#F3F4F6]" />
          <div className="h-11 w-full rounded-lg bg-[#F3F4F6]" />
          <div className="h-11 w-full rounded-lg bg-[#F3F4F6]" />
        </div>
      ) : (
        <>
          {isDetails ? <PersonalInformationStep content={content.personal} /> : null}
          {isMedia ? <PropertySpecificationsStep content={content.property} /> : null}
          {isSubmit ? <VerificationMediaStep content={content.media} /> : null}
        </>
      )}

      <div className="mt-7 flex flex-col gap-2.5">
        <Button
          type="button"
          variant="default"
          shape="pill"
          size="lg"
          className="w-full font-semibold"
          onClick={isSubmit ? submit : goNext}
          disabled={status === "sending" || status === "sent"}
        >
          {isSubmit ? content.buttons.submit : content.buttons.next}
        </Button>
        {status === "sent" || status === "error" ? (
          <p role="status" className={status === "error" ? "text-center text-sm text-destructive" : "text-center text-sm text-a7-text-gray"}>
            {status === "sent" ? "Thank you — our team will contact you shortly." : error}
          </p>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          shape="pill"
          size="lg"
          className="w-full text-black"
          onClick={goBack}
          disabled={isDetails}
        >
          {content.buttons.back}
        </Button>
      </div>
    </div>
    </SellFormValuesProvider>
  )
}

