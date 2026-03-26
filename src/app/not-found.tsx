import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mb-8 text-8xl">🏍️</div>
        <h1 className="font-display mb-4 text-8xl font-bold text-foreground">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Page not found</h2>
        <p className="mb-8 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              Go Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
