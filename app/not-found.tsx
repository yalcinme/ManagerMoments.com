import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="h-screen w-screen gradient-purple flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="pixel-card p-6 text-center bg-white">
          <div className="mb-6">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="font-display text-lg text-contrast-dark tracking-wide mb-2">PAGE NOT FOUND</h1>
            <p className="font-body text-sm text-contrast-dark leading-relaxed">
              This page doesn't exist. Let's get you back to creating your FPL Manager Moments!
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/">
              <Button className="pixel-button w-full py-3 font-display text-xs tracking-wide">
                <Home className="w-4 h-4 mr-2" />
                GO HOME
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
