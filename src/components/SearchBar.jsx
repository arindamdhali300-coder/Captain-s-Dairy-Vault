import { motion, AnimatePresence } from 'framer-motion'
import MoodPicker from './MoodPicker'

export default function SearchBar({ value, onChange, selectedMood, onMoodSelect, showFavorites, onToggleFavorites }) {
    return (
        <div className="space-y-3">
            <div className="relative">
                {/* Search icon */}
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-[14px] opacity-40">🔍</span>
                </div>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search your memories..."
                    name="search-input"
                    id="search-input"
                    className="glass-input w-full py-3.5 pl-10 pr-12 text-[14px] font-body"
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                        onClick={onToggleFavorites}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{
                            background: showFavorites ? 'var(--accent-light)' : 'transparent',
                            opacity: showFavorites ? 0.3 : 1
                        }}
                    >
                        <span className="text-[14px]">{showFavorites ? '❤️' : '🤍'}</span>
                    </button>
                    {value && (
                        <button
                            onClick={() => onChange('')}
                            className="w-5 h-5 rounded-full flex items-center justify-center bg-white/5 text-white/30 text-[10px]"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Mood Chips */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onMoodSelect(null)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-body transition-all border"
                    style={{
                        background: !selectedMood ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                        borderColor: !selectedMood ? 'var(--accent-light)' : 'rgba(255,255,255,0.1)',
                        color: !selectedMood ? 'white' : 'var(--text-muted)',
                        opacity: !selectedMood ? 0.8 : 0.6
                    }}
                >
                    All Moods
                </button>
                <div className="flex-1 overflow-x-auto scrollbar-hide py-1">
                    <MoodPicker selectedMood={selectedMood} onSelect={onMoodSelect} />
                </div>
            </div>
        </div>
    )
}
