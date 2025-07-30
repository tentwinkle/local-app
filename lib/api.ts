export interface APIUser {
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
}

export async function fetchUsersFromAPI(page = 1): Promise<APIUser[]> {
  const response = await fetch(`https://randomuser.me/api/?page=${page}&results=10`)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  const data = await response.json()
  return data.results
}
