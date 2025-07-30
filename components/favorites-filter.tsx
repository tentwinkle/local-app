"use client"

import { useUserStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function FavoritesFilter() {
  const { showFavoritesOnly, setShowFavoritesOnly } = useUserStore()

  return (
    <Button
      variant={showFavoritesOnly ? "default" : "outline"}
      size="sm"
      onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
    >
      <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? "fill-current" : ""}`} />
      {showFavoritesOnly ? "Show All" : "Favorites Only"}
    </Button>
  )
}
