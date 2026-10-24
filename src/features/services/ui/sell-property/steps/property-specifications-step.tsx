"use client"

import { BedDouble, Hash, Home, MapPin, Ruler, Tag } from "lucide-react"

import { Button } from "@/shared/ui/button"
import { Field, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import type { SellPropertyFormContent } from "@/features/services/core/sell-property-content"
import { useSellFormValues } from "@/features/services/ui/sell-property/form-values"

export function PropertySpecificationsStep({ content }: { content: SellPropertyFormContent["property"] }) {
  const { values, setValue } = useSellFormValues()
  const propertyFor = values.propertyFor ?? "rent"
  const setPropertyFor = (v: "sale" | "rent" | "management") => setValue("propertyFor", v)

  return (
    <div className="mt-7 space-y-4">
      <h2 className="text-xl font-inter leading-tight font-semibold text-a7-black">{content.heading}</h2>

      <div className="space-y-2 pt-1">
        <p className="text-sm font-semibold text-a7-text-gray">{content.propertyForLabel}</p>
        <div className="grid w-full grid-cols-1 gap-2 min-[400px]:grid-cols-3">
          <Button
            type="button"
            variant={propertyFor === "sale" ? "default" : "outline"}
            size="sm"
            shape="pill"
            className="h-11 w-full text-sm"
            onClick={() => setPropertyFor("sale")}
          >
            {content.propertyFor.sale}
          </Button>
          <Button
            type="button"
            variant={propertyFor === "rent" ? "default" : "outline"}
            size="sm"
            shape="pill"
            className="h-11 w-full text-sm"
            onClick={() => setPropertyFor("rent")}
          >
            {content.propertyFor.rent}
          </Button>
          <Button
            type="button"
            variant={propertyFor === "management" ? "default" : "outline"}
            size="sm"
            shape="pill"
            className="h-11 w-full text-sm"
            onClick={() => setPropertyFor("management")}
          >
            {content.propertyFor.management}
          </Button>
        </div>
      </div>

      <Field orientation="vertical">
        <FieldLabel htmlFor="sp-location-select">{content.location.label}</FieldLabel>
        <Select value={values["sp-location-select"]} onValueChange={(v) => setValue("sp-location-select", v)}>
          <SelectTrigger id="sp-location-select" radius="lg" icon={<MapPin className="size-4" />} iconPosition="start">
            <SelectValue placeholder={content.location.placeholder} />
          </SelectTrigger>
          <SelectContent position="popper" className="max-sm:w-(--radix-select-trigger-width) max-sm:min-w-(--radix-select-trigger-width)">
            {content.location.options.filter((option) => option.value).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field orientation="vertical">
        <FieldLabel htmlFor="sp-property-type">{content.propertyType.label}</FieldLabel>
        <Select value={values["sp-property-type"]} onValueChange={(v) => setValue("sp-property-type", v)}>
          <SelectTrigger id="sp-property-type" radius="lg" icon={<Home className="size-4" />} iconPosition="start">
            <SelectValue placeholder={content.propertyType.placeholder} />
          </SelectTrigger>
          <SelectContent position="popper" className="max-sm:w-(--radix-select-trigger-width) max-sm:min-w-(--radix-select-trigger-width)">
            {content.propertyType.options.filter((option) => option.value).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field orientation="vertical">
        <FieldLabel htmlFor="sp-bed">{content.bed.label}</FieldLabel>
        <Select value={values["sp-bed"]} onValueChange={(v) => setValue("sp-bed", v)}>
          <SelectTrigger id="sp-bed" radius="lg" icon={<BedDouble className="size-4" />} iconPosition="start">
            <SelectValue placeholder={content.bed.placeholder} />
          </SelectTrigger>
          <SelectContent position="popper" className="max-sm:w-(--radix-select-trigger-width) max-sm:min-w-(--radix-select-trigger-width)">
            {content.bed.options.filter((option) => option.value).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field orientation="vertical">
        <FieldLabel htmlFor="sp-size">{content.size.label}</FieldLabel>
        <Input id="sp-size" defaultValue={values["sp-size"]} radius="lg" placeholder={content.size.placeholder} icon={<Ruler className="size-4" />} iconPosition="start" />
      </Field>

      <Field orientation="vertical">
        <FieldLabel htmlFor="sp-unit">{content.unit.label}</FieldLabel>
        <Input id="sp-unit" defaultValue={values["sp-unit"]} radius="lg" placeholder={content.unit.placeholder} icon={<Hash className="size-4" />} iconPosition="start" />
      </Field>

      <Field orientation="vertical">
        <FieldLabel htmlFor="sp-price">{content.price.label}</FieldLabel>
        <Input id="sp-price" defaultValue={values["sp-price"]} radius="lg" placeholder={content.price.placeholder} icon={<Tag className="size-4" />} iconPosition="start" />
      </Field>
    </div>
  )
}
