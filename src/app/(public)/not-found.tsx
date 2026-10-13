import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-heading text-7xl font-semibold text-black">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-black">Page not found</h1>
      <p className="mt-2 max-w-md text-a7-text-gray/80">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:brightness-95"
        >
          Back to home
        </Link>
        <Link
          href="/properties"
          className="rounded-lg border border-black/15 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-50"
        >
          Browse properties
        </Link>
      </div>
    </main>
  )
}
