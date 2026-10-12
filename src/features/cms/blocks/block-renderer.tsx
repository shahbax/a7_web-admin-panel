"use client"

import { blockComponents } from "@/features/cms/blocks/components"
import type { Block } from "@/features/cms/blocks/types"

/**
 * Renders a list of blocks. Client component so the block-component dictionary
 * (a plain map exported from a "use client" module) resolves within the client
 * module graph; it still server-renders (SSR) for SEO and first paint.
 */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks
        .filter((b) => b.visible !== false)
        .map((block) => {
          const Component = blockComponents[block.type]
          if (!Component) return null
          return <Component key={block.id} props={block.props} />
        })}
    </>
  )
}
