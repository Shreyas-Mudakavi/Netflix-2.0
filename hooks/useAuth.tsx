import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'

import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth } from '../firebase'

interface AuthProviderProps {
  children: React.ReactNode // reactNode is a node in the DOM tree (JSX) that can be rendered to the screen (React.ReactNode) or not (React.ReactNode)
}

interface IAuth {
  user: User | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  error: string | null
  loading: boolean
}

const AuthContext = createContext<IAuth>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  logOut: async () => {},
  error: null,
  loading: false,
})

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [initailLoading, setInitailLoading] = useState(true) // initialLoading will block the UI when logging
  const router = useRouter()

  // Persisting the user

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // logged in...
        setUser(user)
        setLoading(false)
      } else {
        // not logged in...
        setUser(null)
        setLoading(true)
        router.push('/login')
      }
      setInitailLoading(false)
    })
  }, [auth])

  const signUp = async (email: string, password: string) => {
    setLoading(true)

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentail) => {
        setUser(userCredentail.user)
        router.push('/')

        setLoading(false)
      })
      .catch((err) => console.log(err.message))
      .finally(() => {
        setLoading(false)
      })
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredentail) => {
        setUser(userCredentail.user)
        router.push('/')

        setLoading(false)
      })
      .catch((err) => console.log(err.message))
      .finally(() => {
        setLoading(false)
      })
  }

  const logOut = async () => {
    setLoading(true)

    signOut(auth)
      .then(() => setUser(null))
      .catch((err) => console.log(err.message))
      .finally(() => {
        setLoading(false)
      })
  }

  const memoedValue = useMemo(
    () => ({
      user,
      signIn,
      signUp,
      logOut,
      loading,
      error,
    }),
    [user, loading]
  )

  return (
    <AuthContext.Provider value={memoedValue}>
      {!initailLoading && children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
