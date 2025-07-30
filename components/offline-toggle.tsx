"use client"

import { useUserStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { WifiOff, Wifi } from "lucide-react"

export function OfflineToggle() {
  const { isOffline, setOfflineMode } = useUserStore()

  const toggleOffline = () => {
    setOfflineMode(!isOffline)
  }

  return (
    <Button onClick={toggleOffline} variant={isOffline ? "destructive" : "outline"} size="sm">
      {isOffline ? (
        <>
          <WifiOff className="w-4 h-4 mr-2" />
          Go Online
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 mr-2" />
          Go Offline
        </>
      )}
    </Button>
  )
}
