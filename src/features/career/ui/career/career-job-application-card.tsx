import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, AtSign } from "lucide-react"

import { LinkedInBrandIcon } from "@/shared/ui/brand-icons"
import { Button } from "@/shared/ui/button"
import { careerPath } from "@/shared/lib/constants/routes"

import { CareerApplicationForm } from "./career-application-form"

type CareerJobApplicationCardProps = {
  /** Job reference recorded with the application (e.g. the job title). */
  reference?: string
  manager: {
    name: string
    title: string
    avatarUrl: string
  }
}

export function CareerJobApplicationCard({ manager, reference }: CareerJobApplicationCardProps) {
  return (
    <>
     <div className="rounded-md border border-border p-3 text-center">
        <Image
          src={manager.avatarUrl}
          alt={manager.name}
          width={48}
          height={48}
          className="mx-auto size-12 rounded-full object-cover"
        />
        <p className="mt-1.5 text-[10px] text-a7-text-gray">Reports to</p>
        <p className="text-xs font-semibold text-a7-black">{manager.name}</p>
        <p className="text-[10px] text-a7-text-gray">{manager.title}</p>
        <Button
          variant="outline"
          size="sm"
          shape="pill"
          iconRight={<AtSign className="size-4" />}
          className="mt-3 h-12 w-full border-black/35 bg-transparent text-sm font-semibold text-a7-black"
        >
          Apply with Email
        </Button>
        <Button
          variant="default"
          size="sm"
          shape="pill"
          iconRight={
            <span className="inline-flex size-4 items-center justify-center rounded-[3px] bg-white">
              <LinkedInBrandIcon className="size-3 text-[#0A66C2]" />
            </span>
          }
          className="mt-3 h-12 w-full bg-[#0A66C2] text-sm font-semibold text-white hover:bg-[#0A66C2]/90"
        >
          Apply with LinkedIn
        </Button>
      </div>
    <div className="rounded-md border border-border bg-white p-3.5 mt-3">
     

      <CareerApplicationForm reference={reference} />

      <p className="mt-2 text-center text-[10px] text-a7-text-gray">
        Need help instead?{" "}
        <Link href={careerPath()} className="inline-flex items-center gap-0.5 text-a7-black hover:underline">
          Contact careers team
          <ArrowUpRight className="size-3" aria-hidden />
        </Link>
      </p>
    </div>
    </>
  )
}
