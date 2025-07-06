// // lib/auth.ts
// "use client"

// import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'

// interface User {
//   id: string
//   name: string
//   email: string
//   role: string
// }

// interface AuthContextType {
//   user: User | null
//   token: string | null
//   login: (token: string, userData: User) => void
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [token, setToken] = useState<string | null>(null)
//   const router = useRouter()

//   useEffect(() => {
//     // Initialize from localStorage
//     const storedToken = localStorage.getItem('token')
//     const storedUser = localStorage.getItem('user')
    
//     if (storedToken && storedUser) {
//       setToken(storedToken)
//       setUser(JSON.parse(storedUser))
//     }
//   }, [])

//   const login = (newToken: string, userData: User) => {
//     localStorage.setItem('token', newToken)
//     localStorage.setItem('user', JSON.stringify(userData))
//     setToken(newToken)
//     setUser(userData)
//   }

//   const logout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     setToken(null)
//     setUser(null)
//     router.push('/login')
//   }

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }