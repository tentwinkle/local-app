import { Loader2 } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
        <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
      </div>
    </div>
  )
}
