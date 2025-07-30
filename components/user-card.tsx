"use client"

import type { User } from "@/lib/store"
import { useUserStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Mail, MapPin, Phone, UserIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const toggleFavorite = useUserStore((state) => state.toggleFavorite)
  const [imageError, setImageError] = useState(false)

  const handleToggleFavorite = () => {
    toggleFavorite(user.id)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
      <CardContent className="p-0">
        <div className="relative">
          {!imageError ? (
            <Image
              src={user.picture.large || "/placeholder.svg"}
              alt={`${user.name.first} ${user.name.last}`}
              width={300}
              height={300}
              className="w-full h-48 object-cover"
              onError={handleImageError}
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <UserIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
          )}

          <Button
            onClick={handleToggleFavorite}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                user.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
              }`}
            />
          </Button>

          {user.isFavorite && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Favorite
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3 line-clamp-1">
            {user.name.first} {user.name.last}
          </h3>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 flex-shrink-0 text-blue-500" />
              <span className="truncate" title={user.email}>
                {user.email}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0 text-green-500" />
              <span className="truncate" title={`${user.location.city}, ${user.location.country}`}>
                {user.location.city}, {user.location.country}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0 text-purple-500" />
              <span className="truncate" title={user.phone}>
                {user.phone}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
