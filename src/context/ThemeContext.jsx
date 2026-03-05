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
    },
    {
        id: 'sunset-glow',
        name: 'Sunset Glow',
        icon: '🌅',
        colors: { primary: '#f97316', bg: '#1a0f0a' }
    },
    {
        id: 'lavender-dream',
        name: 'Lavender Dream',
        icon: '💜',
        colors: { primary: '#a78bfa', bg: '#1a0f2e' }
    },
    {
        id: 'golden-hour',
        name: 'Golden Hour',
        icon: '🌟',
        colors: { primary: '#fbbf24', bg: '#1a1a0f' }
    },
    {
        id: 'cherry-blossom',
        name: 'Cherry Blossom',
        icon: '🌸',
        colors: { primary: '#f87171', bg: '#1a0f0f' }
    },
    {
        id: 'arctic-frost',
        name: 'Arctic Frost',
        icon: '❄️',
        colors: { primary: '#60a5fa', bg: '#0f0f1a' }
    },
    {
        id: 'autumn-leaves',
        name: 'Autumn Leaves',
        icon: '🍂',
        colors: { primary: '#fb923c', bg: '#1a0f05' }
    },
    {
        id: 'cosmic-purple',
        name: 'Cosmic Purple',
        icon: '🌌',
        colors: { primary: '#c084fc', bg: '#0f051a' }
    },
    {
        id: 'mint-fresh',
        name: 'Mint Fresh',
        icon: '🌿',
        colors: { primary: '#6ee7b7', bg: '#0a1a0f' }
    }
]

export function ThemeProvider({ children }) {
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('captain-diary-theme') || 'midnight-rose'
    })

    const [layout, setLayout] = useState(() => {
        return localStorage.getItem('captain-diary-layout') || 'card'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', currentTheme)
        localStorage.setItem('captain-diary-theme', currentTheme)
    }, [currentTheme])

    useEffect(() => {
        localStorage.setItem('captain-diary-layout', layout)
    }, [layout])

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme, layout, setLayout }}>
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
