"use client"

import { createContext, useContext } from "react"

export type SellFormValues = Record<string, string>

type SellFormValuesContextValue = {
  values: SellFormValues
  setValue: (key: string, value: string) => void
}

const SellFormValuesContext = createContext<SellFormValuesContextValue>({
  values: {},
  setValue: () => {},
})

export const SellFormValuesProvider = SellFormValuesContext.Provider

/** Values entered across the sell-property wizard steps (kept when switching steps). */
export function useSellFormValues() {
  return useContext(SellFormValuesContext)
}
