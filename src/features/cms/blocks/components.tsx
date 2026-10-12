"use client"

import { motion } from "framer-motion"
import {
  Home,
  Key,
  Building,
  Building2,
  MapPin,
  ShieldCheck,
  Star,
  TrendingUp,
  Handshake,
  Award,
  Clock,
  Users,
  Phone,
  Mail,
  Heart,
  Sparkles,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/cn"
import type { BlockProps } from "@/features/cms/blocks/types"

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const VIEWPORT = { once: true, amount: 0.3 as const }

const ICONS: Record<string, LucideIcon> = {
  home: Home, key: Key, building: Building, building2: Building2, mapPin: MapPin,
  shield: ShieldCheck, star: Star, trending: TrendingUp, handshake: Handshake,
  award: Award, clock: Clock, users: Users, phone: Phone, mail: Mail,
  heart: Heart, sparkles: Sparkles, check: CheckCircle2,
}

function s(props: BlockProps, key: string, fallback = ""): string {
  const v = props[key]
  return typeof v === "string" ? v : fallback
}
function arr(props: BlockProps, key: string): Record<string, unknown>[] {
  const v = props[key]
  return Array.isArray(v) ? (v as Record<string, unknown>[]) : []
}

const BG: Record<string, string> = {
  white: "bg-white text-a7-text-gray",
  cream: "bg-[#f7f5f0] text-a7-text-gray",
  dark: "bg-black text-white",
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function Section({
  background = "white",
  children,
  className,
}: {
  background?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn(BG[background] ?? BG.white, "py-16 md:py-24", className)}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  )
}

function buttonVariant(v: string): "default" | "outline" | "link" {
  if (v === "outline") return "outline"
  if (v === "link") return "link"
  return "default"
}

function Heading({ children, align, dark }: { children: React.ReactNode; align: string; dark?: boolean }) {
  return (
    <h2
      className={cn(
        "font-heading text-[clamp(1.75rem,4.2vw,3rem)] font-semibold tracking-tight md:text-[44px] md:leading-[1.1]",
        align === "center" && "text-center",
        dark ? "text-white" : "text-black",
      )}
    >
      {children}
    </h2>
  )
}

// --- Block components -------------------------------------------------------

function SectionHeadingBlock({ props }: { props: BlockProps }) {
  const align = s(props, "align", "left")
  const bg = s(props, "background", "white")
  const dark = bg === "dark"
  return (
    <Section background={bg}>
      <Reveal>
        <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
          {s(props, "eyebrow") ? (
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {s(props, "eyebrow")}
            </p>
          ) : null}
          <Heading align={align} dark={dark}>{s(props, "heading")}</Heading>
          {s(props, "description") ? (
            <p className={cn("mt-4 text-base leading-relaxed", dark ? "text-white/80" : "text-a7-text-gray/80")}>
              {s(props, "description")}
            </p>
          ) : null}
        </div>
      </Reveal>
    </Section>
  )
}

function RichTextBlock({ props }: { props: BlockProps }) {
  const bg = s(props, "background", "white")
  return (
    <Section background={bg}>
      <Reveal>
        <div
          className="prose prose-neutral max-w-3xl prose-headings:font-heading"
          dangerouslySetInnerHTML={{ __html: s(props, "html") }}
        />
      </Reveal>
    </Section>
  )
}

function ButtonsBlock({ props }: { props: BlockProps }) {
  const align = s(props, "align", "left")
  return (
    <Section background={s(props, "background", "white")}>
      <Reveal>
        <div className={cn("flex flex-wrap gap-4", align === "center" && "justify-center")}>
          {arr(props, "buttons").map((b, i) => (
            <Button key={i} asChild variant={buttonVariant(String(b.variant ?? "primary"))} size="lg">
              <a href={String(b.href ?? "#")}>{String(b.label ?? "Button")}</a>
            </Button>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}

function ImageBlock({ props }: { props: BlockProps }) {
  const src = s(props, "src")
  return (
    <Section background={s(props, "background", "white")}>
      <Reveal>
        <figure>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={s(props, "alt")} className="w-full rounded-2xl object-cover" loading="lazy" />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-2xl bg-neutral-100 text-sm text-muted-foreground">
              No image selected
            </div>
          )}
          {s(props, "caption") ? (
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">{s(props, "caption")}</figcaption>
          ) : null}
        </figure>
      </Reveal>
    </Section>
  )
}

function ImageTextBlock({ props }: { props: BlockProps }) {
  const bg = s(props, "background", "white")
  const dark = bg === "dark"
  const imageLeft = s(props, "imagePosition", "left") === "left"
  const src = s(props, "image")
  const button = s(props, "buttonLabel")
  return (
    <Section background={bg}>
      <div className={cn("grid items-center gap-10 lg:grid-cols-2")}>
        <Reveal>
          <div className={cn(!imageLeft && "lg:order-2")}>
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={s(props, "alt")} className="w-full rounded-2xl object-cover" loading="lazy" />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-neutral-100 text-sm text-muted-foreground">
                No image
              </div>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className={cn(!imageLeft && "lg:order-1")}>
            {s(props, "eyebrow") ? (
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{s(props, "eyebrow")}</p>
            ) : null}
            <Heading align="left" dark={dark}>{s(props, "heading")}</Heading>
            <div
              className={cn("prose prose-neutral mt-4 max-w-none", dark && "prose-invert")}
              dangerouslySetInnerHTML={{ __html: s(props, "body") }}
            />
            {button ? (
              <div className="mt-6">
                <Button asChild size="lg"><a href={s(props, "buttonHref", "#")}>{button}</a></Button>
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

function FeatureGridBlock({ props }: { props: BlockProps }) {
  const bg = s(props, "background", "white")
  const dark = bg === "dark"
  const cols = s(props, "columns", "3")
  const colCls = cols === "2" ? "sm:grid-cols-2" : cols === "4" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"
  return (
    <Section background={bg}>
      {s(props, "heading") ? (
        <Reveal><Heading align="left" dark={dark}>{s(props, "heading")}</Heading></Reveal>
      ) : null}
      <div className={cn("mt-10 grid gap-6", colCls)}>
        {arr(props, "items").map((item, i) => {
          const Icon = ICONS[String(item.icon ?? "")] ?? Sparkles
          return (
            <Reveal key={i} delay={i * 0.06}>
              <div className={cn("rounded-2xl border p-6", dark ? "border-white/15" : "border-black/10")}>
                <span className={cn("inline-flex size-12 items-center justify-center rounded-xl", dark ? "bg-white/10 text-white" : "bg-primary/10 text-primary")}>
                  <Icon className="size-6" />
                </span>
                <h3 className={cn("mt-4 text-lg font-semibold", dark ? "text-white" : "text-black")}>{String(item.title ?? "")}</h3>
                <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-white/70" : "text-a7-text-gray/80")}>{String(item.text ?? "")}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}

function StatsBlock({ props }: { props: BlockProps }) {
  const bg = s(props, "background", "cream")
  const dark = bg === "dark"
  return (
    <Section background={bg}>
      <div className="grid gap-8 sm:grid-cols-3">
        {arr(props, "items").map((item, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="text-center">
              <p className={cn("font-heading text-4xl font-semibold md:text-5xl", dark ? "text-white" : "text-black")}>{String(item.value ?? "")}</p>
              <p className={cn("mt-2 text-sm uppercase tracking-wide", dark ? "text-white/70" : "text-a7-text-gray/70")}>{String(item.label ?? "")}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

function CardGridBlock({ props }: { props: BlockProps }) {
  const bg = s(props, "background", "white")
  const dark = bg === "dark"
  return (
    <Section background={bg}>
      {s(props, "heading") ? <Reveal><Heading align="left" dark={dark}>{s(props, "heading")}</Heading></Reveal> : null}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {arr(props, "cards").map((card, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <a href={String(card.href ?? "#")} className="group block overflow-hidden rounded-2xl border border-black/10 transition-shadow hover:shadow-lg">
              {card.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={String(card.image)} alt={String(card.title ?? "")} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              ) : (
                <div className="aspect-[4/3] w-full bg-neutral-100" />
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-black">{String(card.title ?? "")}</h3>
                <p className="mt-2 text-sm text-a7-text-gray/80">{String(card.text ?? "")}</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

function CtaBannerBlock({ props }: { props: BlockProps }) {
  const bg = s(props, "background", "dark")
  const dark = bg === "dark"
  return (
    <Section background={bg}>
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <Heading align="center" dark={dark}>{s(props, "heading")}</Heading>
          {s(props, "text") ? (
            <p className={cn("mt-4 text-base", dark ? "text-white/80" : "text-a7-text-gray/80")}>{s(props, "text")}</p>
          ) : null}
          {s(props, "buttonLabel") ? (
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg"><a href={s(props, "buttonHref", "#")}>{s(props, "buttonLabel")}</a></Button>
            </div>
          ) : null}
        </div>
      </Reveal>
    </Section>
  )
}

function FaqBlock({ props }: { props: BlockProps }) {
  const bg = s(props, "background", "white")
  const dark = bg === "dark"
  return (
    <Section background={bg}>
      {s(props, "heading") ? <Reveal><Heading align="left" dark={dark}>{s(props, "heading")}</Heading></Reveal> : null}
      <div className="mx-auto mt-8 max-w-3xl divide-y divide-black/10">
        {arr(props, "items").map((item, i) => (
          <details key={i} className="group py-4">
            <summary className={cn("flex cursor-pointer list-none items-center justify-between text-left text-lg font-medium", dark ? "text-white" : "text-black")}>
              {String(item.question ?? "")}
              <span className="ml-4 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className={cn("mt-3 text-sm leading-relaxed", dark ? "text-white/70" : "text-a7-text-gray/80")}>{String(item.answer ?? "")}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

function SpacerBlock({ props }: { props: BlockProps }) {
  const size = s(props, "size", "md")
  const h = size === "sm" ? "h-8" : size === "lg" ? "h-28" : "h-16"
  const divider = props.divider === true
  return (
    <div className={cn("container mx-auto px-4", h, "flex items-center")}>
      {divider ? <hr className="w-full border-black/10" /> : null}
    </div>
  )
}

export const blockComponents: Record<string, (p: { props: BlockProps }) => React.ReactNode> = {
  "generic.sectionHeading": SectionHeadingBlock,
  "generic.richText": RichTextBlock,
  "generic.buttons": ButtonsBlock,
  "generic.image": ImageBlock,
  "generic.imageText": ImageTextBlock,
  "generic.featureGrid": FeatureGridBlock,
  "generic.stats": StatsBlock,
  "generic.cardGrid": CardGridBlock,
  "generic.ctaBanner": CtaBannerBlock,
  "generic.faq": FaqBlock,
  "generic.spacer": SpacerBlock,
}
