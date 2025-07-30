import Dexie, { type Table } from "dexie"
import type { User } from "./store"

export class UserDatabase extends Dexie {
  users!: Table<User>

  constructor() {
    super("UserDatabase")
    this.version(1).stores({
      users: "id, email, name.first, name.last, location.city, location.country, isFavorite",
    })
  }
}

export const db = new UserDatabase()
