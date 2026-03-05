import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import DiaryCard from '../components/DiaryCard'
import DiaryCardList from '../components/DiaryCardList'
import DiaryCardGrid from '../components/DiaryCardGrid'
import DiaryCardMinimal from '../components/DiaryCardMinimal'
import EntryComposer from '../components/EntryComposer'
import SearchBar from '../components/SearchBar'
import StatsPanel from '../components/StatsPanel'
import ThemeSwitcher from '../components/ThemeSwitcher'
import LayoutSwitcher from '../components/LayoutSwitcher'
import ExportPanel from '../components/ExportPanel'
import CustomizationPanel from '../components/CustomizationPanel'
import { testCreateAndDelete } from './test-create-delete.js'

const FAKE_ENTRIES = [
    {
        id: 'fake-1',
        text: "Today was a productive day. I finally finished reading that book on history. The way it describes the interconnectedness of events is fascinating. It makes me think about how our small daily actions might be part of a much larger tapestry of human experience that we can't fully comprehend from our limited perspective.\n\nSometimes I wonder if future historians will look back at our time with the same curiosity that we look at the past. What will they find remarkable about our daily struggles and triumphs? Will they see patterns that we're completely blind to right now?",
        mood: '😊',
        is_favorite: true,
        tags: ['Learning', 'Reflection', 'Goals'],
        category: 'Personal',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
        id: 'fake-2',
        text: "Had a great workout session this morning. Feeling energized and ready to take on the week. I think I'll try that new pasta recipe tonight. Cooking has become such a meditative practice for me lately.\n\nThe way ingredients come together to create something entirely new reminds me of how life works - we take separate experiences, thoughts, and emotions, and somehow they combine to create our unique existence. Maybe that's why I find cooking so therapeutic.",
        mood: '💪',
        is_favorite: false,
        tags: ['Health', 'Personal', 'Ideas'],
        category: 'Health',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 'fake-3',
        text: "The weather is so beautiful outside. I spent a few hours in the park just watching the clouds. It's important to take these moments of peace. In our busy lives, we often forget that simply being present and observing the world around us can be the most profound experience.\n\nI noticed how each cloud had its own personality, moving at its own pace, yet all part of the same sky. There's something deeply philosophical about that - we're all individuals, but we're also connected in ways we don't always recognize.",
        mood: '☁️',
        is_favorite: true,
        tags: ['Reflection', 'Memories', 'Gratitude'],
        category: 'Personal',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
]

export default function DiaryFeed() {
    const { user, signOut, isDummy } = useAuth()
    const { layout, setLayout } = useTheme()
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedMood, setSelectedMood] = useState(null)
    const [showFavorites, setShowFavorites] = useState(false)
    const [editingEntry, setEditingEntry] = useState(null)
    const [isStatsOpen, setIsStatsOpen] = useState(false)
    const [isThemeOpen, setIsThemeOpen] = useState(false)
    const [isExportOpen, setIsExportOpen] = useState(false)
    const [isCustomizationOpen, setIsCustomizationOpen] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [preferences, setPreferences] = useState({
        theme: 'midnight-rose',
        fontFamily: 'Caveat',
        fontSize: 22,
        layout: 'card',
        autoSave: true
    })
    const feedRef = useRef(null)

    useEffect(() => {
        if (!user) return

        if (isDummy) {
            setEntries(FAKE_ENTRIES)
            setLoading(false)
            return
        }

        const fetchEntries = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('diary_entries')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) console.error('Error fetching entries:', error)
            else setEntries(data || [])
            setLoading(false)
        }

        fetchEntries()

        const channel = supabase
            .channel('diary_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'diary_entries', filter: `user_id=eq.${user.id}` },
                () => fetchEntries()
            )
            .subscribe()

        return () => supabase.removeChannel(channel)
    }, [user, isDummy])

    const handleAddEntry = async (text, mood, id = null, tags = [], category = 'Personal') => {
        if (isDummy) {
            if (id) {
                setEntries(prev => prev.map(e => e.id === id ? { ...e, text, mood, tags, category, updated_at: new Date().toISOString() } : e))
            } else {
                const newEntry = {
                    id: 'fake-' + Date.now(),
                    text,
                    mood,
                    tags,
                    category,
                    is_favorite: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
                setEntries(prev => [newEntry, ...prev])
            }
            return
        }

        try {
            if (id) {
                const { error } = await supabase
                    .from('diary_entries')
                    .update({ text: text.trim(), mood, tags, category })
                    .eq('id', id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('diary_entries')
                    .insert([{ text: text.trim(), mood, tags, category, user_id: user.id }])
                if (error) throw error
            }
        } catch (error) {
            alert('Failed to save entry: ' + error.message)
        }
    }

    // Debug test function
    const testDeleteDebug = async () => {
        console.log('🧪 Running create & delete test...')
        const result = await testCreateAndDelete()
        console.log('🧪 Test result:', result)
        alert(`Test: ${result.success ? 'SUCCESS' : 'FAILED'}\n${result.error || 'Check console'}`)
    }

    const handleDeleteEntry = async (id) => {
        if (isDummy) {
            setEntries(prev => prev.filter(e => e.id !== id))
            return
        }

        try {
            console.log('🗑️ Deleting entry:', id)
            
            const { error } = await supabase
                .from('diary_entries')
                .delete()
                .eq('id', id)
                .eq('user_id', user?.id)
            
            console.log('Delete result:', { error })
            
            if (error) {
                console.error('❌ Delete failed:', error)
                alert('Delete failed: ' + error.message)
                return
            }
            
            // Remove from local state
            setEntries(prev => prev.filter(e => e.id !== id))
            console.log('✅ Entry deleted successfully')
            
        } catch (error) {
            console.error('💥 Delete error:', error)
            alert('Error: ' + error.message)
        }
    }

    const handleToggleFavorite = async (id, isFavorite) => {
        if (isDummy) {
            setEntries(prev => prev.map(e => e.id === id ? { ...e, is_favorite: !isFavorite } : e))
            return
        }

        try {
            const { error } = await supabase
                .from('diary_entries')
                .update({ is_favorite: !isFavorite })
                .eq('id', id)
            if (error) throw error
        } catch (error) {
            alert('Error toggling favorite: ' + error.message)
        }
    }

    // Filter logic
    const filteredEntries = entries.filter((e) => {
        const matchesSearch = searchQuery.trim()
            ? e.text.toLowerCase().includes(searchQuery.toLowerCase())
            : true
        const matchesMood = selectedMood ? e.mood === selectedMood : true
        const matchesFavorite = showFavorites ? e.is_favorite : true

        return matchesSearch && matchesMood && matchesFavorite
    })

    // Group entries by date
    const groupedEntries = filteredEntries.reduce((groups, entry) => {
        const date = new Date(entry.created_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
        })
        if (!groups[date]) groups[date] = []
        groups[date].push(entry)
        return groups
    }, {})

    return (
        <div className="relative h-full flex flex-col overflow-hidden" style={{ background: 'var(--bg-main)' }}>
            {/* Header */}
            <header className="relative z-20 flex-shrink-0">
                <div
                    className="px-4 sm:px-6 lg:px-8 pt-4 pb-2"
                    style={{
                        background: 'linear-gradient(180deg, var(--bg-main) 0%, rgba(0,0,0,0.4) 100%)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                        {/* Left Section - Title */}
                        <div className="flex items-center gap-4">
                            <img 
                                src="/captain-diary.jpg" 
                                alt="Captain's Diary Logo" 
                                className="w-8 h-8 rounded-lg object-cover"
                            />
                            <motion.h1
                                className="font-script text-2xl lg:text-3xl bg-clip-text text-transparent leading-tight"
                                style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent-secondary) 45%, var(--accent-light) 100%)' }}
                            >
                                Captain's Diary
                            </motion.h1>
                        </div>

                        {/* Center Section - Action Buttons */}
                        <div className="flex items-center gap-3">
                            <LayoutSwitcher layout={layout} setLayout={setLayout} />
                            <button
                                onClick={() => setIsStatsOpen(true)}
                                className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-white/10 transition-all hover:scale-105"
                                title="Statistics"
                            >
                                📊
                            </button>
                            <button
                                onClick={() => setIsThemeOpen(true)}
                                className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-white/10 transition-all hover:scale-105"
                                title="Themes"
                            >
                                🎨
                            </button>
                            <button
                                onClick={() => setIsExportOpen(true)}
                                className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-white/10 transition-all hover:scale-105"
                                title="Export"
                            >
                                📤
                            </button>
                            <button
                                onClick={() => setIsCustomizationOpen(true)}
                                className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-white/10 transition-all hover:scale-105"
                                title="Customize"
                            >
                                ⚙️
                            </button>
                        </div>

                        {/* Right Section - User Info */}
                        <div className="flex items-center gap-3">
                            <span className="hidden lg:inline text-[11px] text-white/30 font-body truncate max-w-40">
                                {user?.user_metadata?.username || user?.email}
                            </span>
                            <button
                                onClick={signOut}
                                className="px-4 py-2 rounded-full text-[11px] font-body transition-all hover:scale-105"
                                style={{
                                    color: 'var(--accent-light)',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--glass-border)',
                                }}
                            >
                                Log Out
                            </button>
                            {/* Debug Test Button */}
                            <button
                                onClick={testDeleteDebug}
                                className="ml-2 px-3 py-1 rounded-full text-[10px] font-body bg-yellow-500/20 hover:bg-yellow-600/30 transition-colors"
                                title="Test Delete Connection"
                            >
                                🧪 Test
                            </button>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between mb-3">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-white/10 transition-colors"
                            >
                                <span className="text-lg">☰</span>
                            </button>

                            {/* Mobile Title */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                                <img 
                                    src="/captain-diary.jpg" 
                                    alt="Captain's Diary Logo" 
                                    className="w-6 h-6 rounded-lg object-cover"
                                />
                                <motion.h1
                                    className="font-script text-xl bg-clip-text text-transparent leading-tight text-center"
                                    style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent-secondary) 45%, var(--accent-light) 100%)' }}
                                >
                                    Captain's Diary
                                </motion.h1>
                            </div>

                            {/* Mobile User Button */}
                            <button
                                onClick={signOut}
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
                                style={{
                                    color: 'var(--accent-light)',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--glass-border)',
                                }}
                                title="Log Out"
                            >
                                👤
                            </button>
                        </div>

                        {/* Mobile Menu */}
                        <AnimatePresence>
                            {showMobileMenu && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-4 gap-2 py-3 border-t border-white/10">
                                        <button
                                            onClick={() => { setIsStatsOpen(true); setShowMobileMenu(false); }}
                                            className="flex flex-col items-center gap-1 p-3 rounded-lg glass-card hover:bg-white/10 transition-colors"
                                        >
                                            <span className="text-lg">📊</span>
                                            <span className="text-[8px] text-white/60">Stats</span>
                                        </button>
                                        <button
                                            onClick={() => { setIsThemeOpen(true); setShowMobileMenu(false); }}
                                            className="flex flex-col items-center gap-1 p-3 rounded-lg glass-card hover:bg-white/10 transition-colors"
                                        >
                                            <span className="text-lg">🎨</span>
                                            <span className="text-[8px] text-white/60">Theme</span>
                                        </button>
                                        <button
                                            onClick={() => { setIsExportOpen(true); setShowMobileMenu(false); }}
                                            className="flex flex-col items-center gap-1 p-3 rounded-lg glass-card hover:bg-white/10 transition-colors"
                                        >
                                            <span className="text-lg">📤</span>
                                            <span className="text-[8px] text-white/60">Export</span>
                                        </button>
                                        <button
                                            onClick={() => { setIsCustomizationOpen(true); setShowMobileMenu(false); }}
                                            className="flex flex-col items-center gap-1 p-3 rounded-lg glass-card hover:bg-white/10 transition-colors"
                                        >
                                            <span className="text-lg">⚙️</span>
                                            <span className="text-[8px] text-white/60">Settings</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Search Bar */}
                <div
                    className="px-5 sm:px-6 pb-3 pt-1"
                    style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)' }}
                >
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        selectedMood={selectedMood}
                        onMoodSelect={setSelectedMood}
                        showFavorites={showFavorites}
                        onToggleFavorites={() => setShowFavorites(!showFavorites)}
                    />
                </div>

                {/* ... divider remains same */}
            </header>

            {/* Feed */}
            <main ref={feedRef} className="flex-1 overflow-y-auto overflow-x-hidden pt-2 scroll-smooth">
                <div className="max-w-2xl mx-auto px-5 sm:px-6 pb-24">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 opacity-20">
                            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4" />
                            <p className="font-body text-[12px] tracking-widest uppercase">Reading Memories...</p>
                        </div>
                    ) : Object.keys(groupedEntries).length > 0 ? (
                        Object.entries(groupedEntries).map(([date, dateEntries]) => (
                            <div key={date} className="mb-10 first:mt-4">
                                {/* Date Header */}
                                <div className="flex items-center gap-3 mb-6 sticky top-0 z-10 py-2">
                                    <div className="h-[1px] flex-1 bg-white/5" />
                                    <span className="text-[10px] font-body uppercase tracking-[0.2em] text-white/20 bg-deep-dark/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                                        {date}
                                    </span>
                                    <div className="h-[1px] flex-1 bg-white/10" />
                                </div>

                                <div className={layout === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : layout === 'minimal' ? "space-y-1" : "space-y-8"}>
                                    {dateEntries.map((entry, i) => {
                                        if (layout === 'list') {
                                            return (
                                                <DiaryCardList
                                                    key={entry.id}
                                                    entry={entry}
                                                    index={i}
                                                    onDelete={handleDeleteEntry}
                                                    onEdit={setEditingEntry}
                                                    onToggleFavorite={handleToggleFavorite}
                                                />
                                            )
                                        } else if (layout === 'grid') {
                                            return (
                                                <DiaryCardGrid
                                                    key={entry.id}
                                                    entry={entry}
                                                    index={i}
                                                    onDelete={handleDeleteEntry}
                                                    onEdit={setEditingEntry}
                                                    onToggleFavorite={handleToggleFavorite}
                                                />
                                            )
                                        } else if (layout === 'minimal') {
                                            return (
                                                <DiaryCardMinimal
                                                    key={entry.id}
                                                    entry={entry}
                                                    index={i}
                                                    onDelete={handleDeleteEntry}
                                                    onEdit={setEditingEntry}
                                                    onToggleFavorite={handleToggleFavorite}
                                                />
                                            )
                                        } else {
                                            return (
                                                <DiaryCard
                                                    key={entry.id}
                                                    entry={entry}
                                                    index={i}
                                                    onDelete={handleDeleteEntry}
                                                    onEdit={() => setEditingEntry(entry)}
                                                    onToggleFavorite={handleToggleFavorite}
                                                />
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyState isSearching={!!searchQuery || !!selectedMood || showFavorites} />
                    )}
                </div>
            </main>
            {/* Entry Composer */}
            <EntryComposer
                onEntryAdded={handleAddEntry}
                editEntry={editingEntry}
                onCloseEdit={() => setEditingEntry(null)}
            />

            {/* Stats Panel */}
            <StatsPanel isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} entries={entries} />

            {/* Theme Switcher */}
            <ThemeSwitcher isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />

            {/* Export Panel */}
            <ExportPanel isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} entries={entries} />

            {/* Customization Panel */}
            <CustomizationPanel 
                isOpen={isCustomizationOpen} 
                onClose={() => setIsCustomizationOpen(false)} 
                preferences={preferences}
                onPreferencesChange={setPreferences}
            />
        </div>
    )
}

function EmptyState({ isSearching }) {
    return (
        <div className="flex items-center justify-center h-64">
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="text-6xl mb-5 animate-float">
                    {isSearching ? '🔍' : '📓'}
                </div>
                <h2 className="font-script text-3xl text-rose-gold/50 mb-3">
                    {isSearching ? 'No Matches Found' : 'Your Story Begins Here'}
                </h2>
                <p className="text-[13px] text-white/20 font-body max-w-[260px] mx-auto leading-relaxed">
                    {isSearching
                        ? 'Try a different keyword or mood to find your memory.'
                        : 'Write down your first memory. Your future self will thank you.'}
                </p>
            </motion.div>
        </div>
    )
}
