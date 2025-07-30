import jest from "jest"
import "@testing-library/jest-dom"

// Mock IndexedDB for tests
global.indexedDB = require("fake-indexeddb")
global.IDBKeyRange = require("fake-indexeddb/lib/FDBKeyRange")

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  },
}))

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }) => children,
}))
