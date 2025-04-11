"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../../../../../components/layout/DashboardLayout"
import UsersTable from "../../../../../components/tables/UserTable"

interface User {
  id: string
  name: string
  email: string
  role: string
}

// Updated page component with real data fetching
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch users data from your API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/users")

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Handler for impersonating a user
  const handleLoginAsUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/impersonate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id }),
      })

      if (!response.ok) {
        throw new Error("Failed to impersonate user")
      }

      const data = await response.json()

      // Redirect to dashboard with impersonation token or handle as needed
      window.location.href = data.redirectUrl || "/dashboard"
    } catch (err) {
      console.error("Error impersonating user:", err)
      // Handle error
    }
  }

  // Handler for updating user role
  const updateUserRole = async (id: string, role: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user role")
      }

      // Update local state
      setUsers(users.map((user) => (user.id === id ? { ...user, role } : user)))
    } catch (err) {
      console.error("Error updating user role:", err)
      // Handle error
    }
  }

  // Handler for deleting a user
  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      // Update local state
      setUsers(users.filter((user) => user.id !== id))
    } catch (err) {
      console.error("Error deleting user:", err)
      // Handle error
    }
  }

  // Handler for updating user details
  const updateUserDetails = async (id: string, updatedUser: Partial<User>) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })

      if (!response.ok) {
        throw new Error("Failed to update user details")
      }

      // Update local state
      setUsers(users.map((user) => (user.id === id ? { ...user, ...updatedUser } : user)))
    } catch (err) {
      console.error("Error updating user details:", err)
      // Handle error
    }
  }

  // Show loading state while fetching data
  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  // Show error state if fetch failed
  if (error) {
    return (
      <DashboardLayout role="admin">
        <div className="bg-red-500 text-white p-4 rounded-lg">
          <p>Error loading users: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 bg-white text-red-500 px-4 py-2 rounded">
            Retry
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <UsersTable
        users={users}
        handleLoginAsUser={handleLoginAsUser}
        updateUserRole={updateUserRole}
        deleteUser={deleteUser}
        updateUserDetails={updateUserDetails}
      />
    </DashboardLayout>
  )
}
