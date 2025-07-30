"use client"

import { useEffect } from "react"
import { useUserStore } from "@/lib/store"
import { UserCard } from "@/components/user-card"
import { Pagination } from "@/components/pagination"
import { SearchBar } from "@/components/search-bar"
import { OfflineToggle } from "@/components/offline-toggle"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { Button } from "@/components/ui/button"
import { RefreshCw, Wifi, WifiOff } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { FavoritesFilter } from "@/components/favorites-filter"
import { StatsBar } from "@/components/stats-bar"

export default function HomePage() {
  const {
    users,
    filteredUsers,
    loading,
    error,
    isOffline,
    currentPage,
    totalPages,
    searchTerm,
    sortBy,
    fetchUsers,
    setSearchTerm,
    setSortBy,
    setCurrentPage,
    refreshData,
  } = useUserStore()

  useEffect(() => {
    fetchUsers(1)
  }, [fetchUsers])

  const handleRefresh = () => {
    refreshData()
  }

  const handleSort = (field: "name" | "email" | "location") => {
    setSortBy(field === sortBy ? null : field)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Local-First Users</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Offline-capable user directory with local caching</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                {isOffline ? <WifiOff className="w-4 h-4 text-red-500" /> : <Wifi className="w-4 h-4 text-green-500" />}
                <span className="text-gray-600 dark:text-gray-400">{isOffline ? "Offline" : "Online"}</span>
              </div>
              <ThemeToggle />
              <OfflineToggle />
              <Button onClick={handleRefresh} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search users by name or email..." />
            </div>
            <div className="flex gap-2 flex-wrap">
              <FavoritesFilter />
              <Button variant={sortBy === "name" ? "default" : "outline"} size="sm" onClick={() => handleSort("name")}>
                Sort by Name
              </Button>
              <Button
                variant={sortBy === "email" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("email")}
              >
                Sort by Email
              </Button>
              <Button
                variant={sortBy === "location" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("location")}
              >
                Sort by Location
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <StatsBar />
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Users Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <Wifi className="w-16 h-16 mx-auto mb-4 opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? "Try adjusting your search terms." : "Try refreshing to load data."}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
          </>
        )}

        {/* Stats */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
          {isOffline && " (cached data)"}
        </div>
      </div>
    </div>
  )
}
