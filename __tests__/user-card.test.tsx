import { render, screen, fireEvent } from "@testing-library/react"
import { UserCard } from "@/components/user-card"
import { useUserStore } from "@/lib/store"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock the store
jest.mock("@/lib/store")
const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>

const mockUser = {
  id: "1",
  name: { first: "John", last: "Doe" },
  email: "john@example.com",
  picture: { large: "https://example.com/image.jpg", medium: "", thumbnail: "" },
  location: { city: "New York", country: "USA" },
  phone: "123-456-7890",
  isFavorite: false,
}

describe("UserCard", () => {
  const mockToggleFavorite = jest.fn()

  beforeEach(() => {
    mockUseUserStore.mockReturnValue({
      toggleFavorite: mockToggleFavorite,
    } as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders user information correctly", () => {
    render(<UserCard user={mockUser} />)

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("john@example.com")).toBeInTheDocument()
    expect(screen.getByText("New York, USA")).toBeInTheDocument()
    expect(screen.getByText("123-456-7890")).toBeInTheDocument()
  })

  it("calls toggleFavorite when heart button is clicked", () => {
    render(<UserCard user={mockUser} />)

    const favoriteButton = screen.getByRole("button")
    fireEvent.click(favoriteButton)

    expect(mockToggleFavorite).toHaveBeenCalledWith("1")
  })

  it("shows favorite badge when user is favorite", () => {
    const favoriteUser = { ...mockUser, isFavorite: true }
    render(<UserCard user={favoriteUser} />)

    expect(screen.getByText("Favorite")).toBeInTheDocument()
  })
})
