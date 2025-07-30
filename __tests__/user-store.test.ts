import { renderHook, act } from "@testing-library/react"
import { useUserStore } from "@/lib/store"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock fetch
global.fetch = jest.fn()

describe("User Store", () => {
  beforeEach(() => {
    // Reset store state
    useUserStore.getState().users = []
    useUserStore.getState().filteredUsers = []
    useUserStore.getState().loading = false
    useUserStore.getState().error = null
    useUserStore.getState().searchTerm = ""
    useUserStore.getState().sortBy = null
    useUserStore.getState().showFavoritesOnly = false
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useUserStore())

    expect(result.current.users).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.searchTerm).toBe("")
    expect(result.current.sortBy).toBe(null)
  })

  it("should set search term and filter users", () => {
    const { result } = renderHook(() => useUserStore())

    // Add some test users
    act(() => {
      result.current.users = [
        {
          id: "1",
          name: { first: "John", last: "Doe" },
          email: "john@example.com",
          picture: { large: "", medium: "", thumbnail: "" },
          location: { city: "New York", country: "USA" },
          phone: "123-456-7890",
        },
        {
          id: "2",
          name: { first: "Jane", last: "Smith" },
          email: "jane@example.com",
          picture: { large: "", medium: "", thumbnail: "" },
          location: { city: "Los Angeles", country: "USA" },
          phone: "098-765-4321",
        },
      ]
    })

    act(() => {
      result.current.setSearchTerm("john")
    })

    expect(result.current.searchTerm).toBe("john")
    expect(result.current.filteredUsers).toHaveLength(1)
    expect(result.current.filteredUsers[0].name.first).toBe("John")
  })

  it("should toggle favorite status", async () => {
    const { result } = renderHook(() => useUserStore())

    // Add a test user
    act(() => {
      result.current.users = [
        {
          id: "1",
          name: { first: "John", last: "Doe" },
          email: "john@example.com",
          picture: { large: "", medium: "", thumbnail: "" },
          location: { city: "New York", country: "USA" },
          phone: "123-456-7890",
          isFavorite: false,
        },
      ]
    })

    await act(async () => {
      await result.current.toggleFavorite("1")
    })

    expect(result.current.users[0].isFavorite).toBe(true)
  })

  it("should filter favorites only", () => {
    const { result } = renderHook(() => useUserStore())

    // Add test users with mixed favorite status
    act(() => {
      result.current.users = [
        {
          id: "1",
          name: { first: "John", last: "Doe" },
          email: "john@example.com",
          picture: { large: "", medium: "", thumbnail: "" },
          location: { city: "New York", country: "USA" },
          phone: "123-456-7890",
          isFavorite: true,
        },
        {
          id: "2",
          name: { first: "Jane", last: "Smith" },
          email: "jane@example.com",
          picture: { large: "", medium: "", thumbnail: "" },
          location: { city: "Los Angeles", country: "USA" },
          phone: "098-765-4321",
          isFavorite: false,
        },
      ]
    })

    act(() => {
      result.current.setShowFavoritesOnly(true)
    })

    expect(result.current.filteredUsers).toHaveLength(1)
    expect(result.current.filteredUsers[0].isFavorite).toBe(true)
  })
})
