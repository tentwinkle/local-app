"use client"

import { useUserStore } from "@/lib/store"
import { Users, Heart, Wifi, WifiOff } from "lucide-react"

export function StatsBar() {
  const { users, filteredUsers, isOffline } = useUserStore()

  const totalUsers = users.length
  const favoriteUsers = users.filter((user) => user.isFavorite).length
  const displayedUsers = filteredUsers.length

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Total:</span>
            <span className="font-medium text-gray-900 dark:text-white">{totalUsers}</span>
          </div>

          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-gray-600 dark:text-gray-400">Favorites:</span>
            <span className="font-medium text-gray-900 dark:text-white">{favoriteUsers}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">Showing:</span>
            <span className="font-medium text-gray-900 dark:text-white">{displayedUsers}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOffline ? (
            <>
              <WifiOff className="w-4 h-4 text-red-500" />
              <span className="text-red-600 dark:text-red-400 font-medium">Offline Mode</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-medium">Online</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
