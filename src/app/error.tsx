"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mb-8 text-8xl">⚠️</div>
        <h1 className="font-display mb-4 text-4xl font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="mb-2 text-muted-foreground">
          {error.message || 'An unexpected error occurred'}
        </p>
        {error.digest && (
          <p className="mb-8 text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" onClick={reset}>
            Try Again
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
