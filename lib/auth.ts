// Mock authentication utilities for demo purposes
export type UserRole = "admin" | "reseller"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@printshop.com",
    name: "Admin User",
    role: "admin",
    status: "approved",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "reseller1@example.com",
    name: "John Reseller",
    role: "reseller",
    status: "approved",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    email: "reseller2@example.com",
    name: "Jane Partner",
    role: "reseller",
    status: "pending",
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "4",
    email: "reseller3@example.com",
    name: "Mike Distributor",
    role: "reseller",
    status: "approved",
    createdAt: "2024-02-10T00:00:00Z",
  },
]

// Get current user from session (mock)
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("currentUser")
  if (!userStr) return null

  return JSON.parse(userStr)
}

// Login user
export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = MOCK_USERS.find((u) => u.email === email)

  if (!user || password !== "demo123") {
    return { success: false, error: "Invalid email or password" }
  }

  if (user.role === "reseller" && user.status !== "approved") {
    return { success: false, error: "Your account is pending approval" }
  }

  localStorage.setItem("currentUser", JSON.stringify(user))
  return { success: true, user }
}

// Register new reseller
export async function register(
  name: string,
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const existingUser = MOCK_USERS.find((u) => u.email === email)
  if (existingUser) {
    return { success: false, error: "Email already registered" }
  }

  const newUser: User = {
    id: (MOCK_USERS.length + 1).toString(),
    email,
    name,
    role: "reseller",
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  MOCK_USERS.push(newUser)
  return { success: true, user: newUser }
}

// Logout
export function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "/"
}

// Get all users (admin only)
export function getAllUsers(): User[] {
  return MOCK_USERS
}

// Update user status (admin only)
export async function updateUserStatus(userId: string, status: "approved" | "rejected"): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const user = MOCK_USERS.find((u) => u.id === userId)
  if (user) {
    user.status = status
  }

  return { success: true }
}
