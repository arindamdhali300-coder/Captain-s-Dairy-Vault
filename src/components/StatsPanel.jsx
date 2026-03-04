import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function StatsPanel({ isOpen, onClose, entries }) {
    const { user } = useAuth()

    // Calculate Stats
    const totalEntries = entries.length
    const favoritesCount = entries.filter(e => e.is_favorite).length
    const totalWords = entries.reduce((acc, curr) => acc + curr.text.trim().split(/\s+/).length, 0)

    // Mood distribution
    const moodCounts = entries.reduce((acc, curr) => {
        acc[curr.mood] = (acc[curr.mood] || 0) + 1
        return acc
    }, {})
    const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])

    // Streak calculation (simple version)
    const calculateStreak = () => {
        if (!entries.length) return 0
        const dates = [...new Set(entries.map(e => new Date(e.created_at).toDateString()))]
        let streak = 0
        let today = new Date().toDateString()
        let yesterday = new Date(Date.now() - 86400000).toDateString()

        // If last entry isn't today or yesterday, streak is broken
        if (dates[0] !== today && dates[0] !== yesterday) return 0

        // Count consecutive days
        let current = new Date(dates[0])
        streak = 1
        for (let i = 1; i < dates.length; i++) {
            let prevDate = new Date(dates[i])
            let diff = (current - prevDate) / (1000 * 60 * 60 * 24)
            if (diff === 1) {
                streak++
                current = prevDate
            } else {
                break
            }
        }
        return streak
    }
    const streak = calculateStreak()

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-[61] max-h-[85vh] overflow-y-auto rounded-t-[32px] glass-card p-6 pb-12"
                        style={{ background: 'linear-gradient(180deg, rgba(20,15,18,0.98) 0%, rgba(10,10,15,1) 100%)' }}
                    >
                        {/* Drag Handle */}
                        <div className="w-12 h-1.5 rounded-full bg-white/10 mx-auto mb-8" />

                        <div className="max-w-md mx-auto">
                            <h2 className="font-script text-4xl mb-2 text-rose-gold-light text-center">Your Journey</h2>
                            <p className="text-[10px] text-center text-white/20 uppercase tracking-[4px] mb-10">Historical Insights</p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <StatCard label="Memories" value={totalEntries} icon="📓" />
                                <StatCard label="Streak" value={`${streak} days`} icon="🔥" />
                                <StatCard label="Favorites" value={favoritesCount} icon="❤️" />
                                <StatCard label="Words" value={totalWords} icon="✍️" />
                            </div>

                            {/* Mood Distribution */}
                            <div className="p-6 rounded-[24px] glass-card bg-white/[0.02] border-white/[0.05] mb-8">
                                <h3 className="text-[11px] uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
                                    <span>🎭</span> Mood Distribution
                                </h3>
                                <div className="space-y-4">
                                    {sortedMoods.length > 0 ? sortedMoods.slice(0, 5).map(([mood, count]) => (
                                        <div key={mood} className="space-y-1.5">
                                            <div className="flex justify-between text-[13px] px-1">
                                                <span className="flex items-center gap-2">{mood} <span className="text-[11px] text-white/20 font-body">Mood</span></span>
                                                <span className="font-body text-white/40">{Math.round((count / totalEntries) * 100)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(count / totalEntries) * 100}%` }}
                                                    className="h-full bg-rose-gold/40 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-center text-[12px] text-white/10 py-4 italic">No moods recorded yet</p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[14px] text-white/40 hover:text-white/60 transition-colors"
                            >
                                Close Dashboard
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

function StatCard({ label, value, icon }) {
    return (
        <div className="p-5 rounded-[24px] glass-card bg-white/[0.02] border-white/[0.05] flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-3">{icon}</span>
            <span className="text-xl font-body font-semibold text-white/80">{value}</span>
            <span className="text-[10px] text-white/20 uppercase tracking-widest mt-1">{label}</span>
        </div>
    )
}
