import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export const THEMES = [
    {
        id: 'midnight-rose',
        name: 'Midnight Rose',
        icon: '🌹',
        colors: { primary: '#b76e79', bg: '#0a0a0f' }
    },
    {
        id: 'vintage-parchment',
        name: 'Vintage Parchment',
        icon: '📜',
        colors: { primary: '#8b5e3c', bg: '#f4eee0' }
    },
    {
        id: 'emerald-forest',
        name: 'Emerald Forest',
        icon: '🌲',
        colors: { primary: '#34d399', bg: '#06110a' }
    },
    {
        id: 'ocean-breeze',
        name: 'Ocean Breeze',
        icon: '🌊',
        colors: { primary: '#38bdf8', bg: '#0a111a' }
    }
]

export function ThemeProvider({ children }) {
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('captain-diary-theme') || 'midnight-rose'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', currentTheme)
        localStorage.setItem('captain-diary-theme', currentTheme)
    }, [currentTheme])

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
