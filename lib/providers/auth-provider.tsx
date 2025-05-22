'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { Routes } from '@/utils/routes'
import type { User, AuthContextType } from '@/types/core/auth'

// Create the context with a default value 
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a hook to use the auth context 
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// Create the AuthProvider component 
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    // Helper to determine if the current path is public (no auth needed)
    const isPublicPath = useCallback((pathname: string) => {
        return pathname === Routes.LOGIN || pathname.startsWith('/auth');
    }, []);

    // Get current user, update state, and handle redirects
    const getUser = useCallback(async (): Promise<User | null> => {
        try {
            const response = await fetch('/api/auth/session');
            if (!response.ok) {
                setUser(null);
                if (!isPublicPath(window.location.pathname)) {
                    router.push(Routes.LOGIN);
                }
                return null;
            }

            const data = await response.json();
            if (data.user) {
                setUser(data.user);
                return data.user;
            } else {
                setUser(null);
                if (!isPublicPath(window.location.pathname)) {
                    router.push(Routes.LOGIN);
                }
                return null;
            }
        } catch (error) {
            console.error('Get user error:', error);
            setUser(null);
            if (!isPublicPath(window.location.pathname)) {
                router.push(Routes.LOGIN);
            }
            return null;
        }
    }, [router, setUser, isPublicPath]);

    // Check for existing session on mount 
    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true);
            await getUser(); // getUser now handles setUser and redirects
            setIsLoading(false);
        };

        initAuth();
    }, [getUser]);

    // Login function 
    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            // Call the login API - Login the user + create session on the server
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Login failed')
            }

            const userData = await response.json()
            setUser(userData.user)
            router.push(Routes.START)
        } catch (error) {
            console.error('Login error:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Logout function 
    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            setUser(null)
            router.push(Routes.LOGIN)
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    // Provide the auth context value 
    const value = {
        user,
        isLoading,
        login,
        logout,
        getUser,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}