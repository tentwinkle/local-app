import { create } from "zustand"
import { persist } from "zustand/middleware"
import { db } from "./db"
import { fetchUsersFromAPI } from "./api"

export interface User {
  id: string
  name: {
    first: string
    last: string
  }
  email: string
  picture: {
    large: string
    medium: string
    thumbnail: string
  }
  location: {
    city: string
    country: string
  }
  phone: string
  isFavorite?: boolean
}

interface UserStore {
  users: User[]
  filteredUsers: User[]
  loading: boolean
  error: string | null
  isOffline: boolean
  currentPage: number
  totalPages: number
  searchTerm: string
  sortBy: "name" | "email" | "location" | null
  showFavoritesOnly: boolean

  // Actions
  fetchUsers: (page: number) => Promise<void>
  toggleFavorite: (userId: string) => Promise<void>
  setSearchTerm: (term: string) => void
  setSortBy: (field: "name" | "email" | "location" | null) => void
  setCurrentPage: (page: number) => void
  setOfflineMode: (offline: boolean) => void
  refreshData: () => Promise<void>
  filterAndSortUsers: () => void
  setShowFavoritesOnly: (show: boolean) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      filteredUsers: [],
      loading: false,
      error: null,
      isOffline: false,
      currentPage: 1,
      totalPages: 1,
      searchTerm: "",
      sortBy: null,
      showFavoritesOnly: false,

      fetchUsers: async (page: number) => {
        set({ loading: true, error: null, currentPage: page })

        try {
          const { isOffline } = get()
          let users: User[] = []

          if (!isOffline) {
            try {
              // Try to fetch from API
              const apiUsers = await fetchUsersFromAPI(page)
              users = apiUsers.map((user) => ({
                ...user,
                id: user.email, // Use email as unique ID
              }))

              // Store in IndexedDB
              await db.users.clear()
              await db.users.bulkAdd(users)

              // Also store favorites status from existing data
              const existingUsers = await db.users.toArray()
              const updatedUsers = users.map((user) => {
                const existing = existingUsers.find((u) => u.id === user.id)
                return { ...user, isFavorite: existing?.isFavorite || false }
              })

              await db.users.clear()
              await db.users.bulkAdd(updatedUsers)
              users = updatedUsers
            } catch (apiError) {
              console.warn("API fetch failed, falling back to cache:", apiError)
              // Fall back to cached data
              users = await db.users.toArray()
              if (users.length === 0) {
                throw new Error("No cached data available and API is unreachable")
              }
              set({ error: "Using cached data - API unavailable" })
            }
          } else {
            // Offline mode - load from cache
            users = await db.users.toArray()
            if (users.length === 0) {
              throw new Error("No cached data available in offline mode")
            }
          }

          set({
            users,
            loading: false,
            totalPages: Math.ceil(users.length / 10), // Assuming 10 users per page
          })

          // Apply current filters
          get().filterAndSortUsers()
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch users",
            loading: false,
          })
        }
      },

      toggleFavorite: async (userId: string) => {
        const { users } = get()
        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, isFavorite: !user.isFavorite } : user,
        )

        // Update IndexedDB
        const user = updatedUsers.find((u) => u.id === userId)
        if (user) {
          await db.users.put(user)
        }

        set({ users: updatedUsers })
        get().filterAndSortUsers()
      },

      setSearchTerm: (term: string) => {
        set({ searchTerm: term })
        get().filterAndSortUsers()
      },

      setSortBy: (field: "name" | "email" | "location" | null) => {
        set({ sortBy: field })
        get().filterAndSortUsers()
      },

      setCurrentPage: (page: number) => {
        set({ currentPage: page })
        get().fetchUsers(page)
      },

      setOfflineMode: (offline: boolean) => {
        set({ isOffline: offline })
      },

      refreshData: async () => {
        const { currentPage } = get()
        await get().fetchUsers(currentPage)
      },

      filterAndSortUsers: () => {
        const { users, searchTerm, sortBy, showFavoritesOnly } = get()
        let filtered = [...users]

        // Apply favorites filter
        if (showFavoritesOnly) {
          filtered = filtered.filter((user) => user.isFavorite)
        }

        // Apply search filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase()
          filtered = filtered.filter(
            (user) =>
              `${user.name.first} ${user.name.last}`.toLowerCase().includes(term) ||
              user.email.toLowerCase().includes(term),
          )
        }

        // Apply sorting
        if (sortBy) {
          filtered.sort((a, b) => {
            switch (sortBy) {
              case "name":
                const nameA = `${a.name.first} ${a.name.last}`
                const nameB = `${b.name.first} ${b.name.last}`
                return nameA.localeCompare(nameB)
              case "email":
                return a.email.localeCompare(b.email)
              case "location":
                const locationA = `${a.location.city}, ${a.location.country}`
                const locationB = `${b.location.city}, ${b.location.country}`
                return locationA.localeCompare(locationB)
              default:
                return 0
            }
          })
        }

        set({ filteredUsers: filtered })
      },

      setShowFavoritesOnly: (show: boolean) => {
        set({ showFavoritesOnly: show })
        get().filterAndSortUsers()
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        isOffline: state.isOffline,
        searchTerm: state.searchTerm,
        sortBy: state.sortBy,
        showFavoritesOnly: state.showFavoritesOnly,
      }),
    },
  ),
)
