"use client"

import { useActionState } from "react"

import { loginAction, type AuthActionState } from "@/features/auth/services/auth-actions"
import { PasswordInput } from "@/features/auth/ui/password-input"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/shared/ui/field"

const initialState: AuthActionState = {}

export function AdminLoginForm({ redirectFrom }: { redirectFrom?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="space-y-5">
      {redirectFrom ? <input type="hidden" name="from" value={redirectFrom} /> : null}
      <FieldGroup>
        <Field orientation="vertical">
          <FieldContent>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@a7group.com"
              inputSize="lg"
              radius="md"
              autoComplete="email"
              required
            />
          </FieldContent>
        </Field>

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="••••••••"
          required
        />
      </FieldGroup>

      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  )
}
