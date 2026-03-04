import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isDummy, setIsDummy] = useState(false)

    useEffect(() => {
        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user)
                setIsDummy(false)
            }
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.user) {
                    setUser(session.user)
                    setIsDummy(false)
                } else if (!isDummy) {
                    setUser(null)
                }
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [isDummy])

    const signUp = async (email, password, username) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        })
        if (error) throw error
        return data
    }

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setIsDummy(false)
        return data
    }

    const dummySignIn = (email) => {
        setIsDummy(true)
        setUser({
            id: 'dummy-user',
            email: email,
            user_metadata: { username: 'My Secret Diary' }
        })
    }

    const signOut = async () => {
        if (isDummy) {
            setIsDummy(false)
            setUser(null)
        } else {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, isDummy, signUp, signIn, dummySignIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
