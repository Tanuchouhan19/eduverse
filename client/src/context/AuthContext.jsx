  import { createContext, useContext, useState, useEffect, useCallback } from 'react'

  const AuthContext = createContext()

  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      // Check if user is logged in (e.g., from localStorage or API)
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setLoading(false)
    }, [])

    const login = useCallback((userData) => {
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    }, [])

    const logout = useCallback(() => {
      setUser(null)
      localStorage.removeItem('user')
    }, [])

    return (
      <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
      </AuthContext.Provider>
    )
  }

  export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
      throw new Error('useAuth must be used within AuthProvider')
    }
    return context
  }
