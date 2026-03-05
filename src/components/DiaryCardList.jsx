import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../diary-enhancements.css'

function formatDiaryDate(dateStr) {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 12) return `${hours}h ago`

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return `${date.getDate()} ${months[date.getMonth()]}, ${days[date.getDay()]}`
}

function formatTime(dateStr) {
    const date = new Date(dateStr)
    let h = date.getHours()
    const m = String(date.getMinutes()).padStart(2, '0')
    const ampm = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return `${h}:${m} ${ampm}`
}

export default function DiaryCardList({ entry, index, onDelete, onToggleFavorite, onEdit }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const textPreview = entry.text.length > 200 ? entry.text.substring(0, 200) + '...' : entry.text

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="relative glass-card p-4 mb-3 rounded-xl cursor-pointer hover:scale-[1.01] transition-all"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{entry.mood}</span>
                        <div className="flex items-center gap-1 text-[11px] text-white/40">
                            <span>{formatDiaryDate(entry.created_at)}</span>
                            <span>•</span>
                            <span>{formatTime(entry.created_at)}</span>
                        </div>
                    </div>
                    
                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {entry.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 text-[10px] rounded-full"
                                    style={{
                                        background: 'var(--accent)',
                                        color: 'white',
                                        opacity: 0.7
                                    }}
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleFavorite(entry.id, entry.is_favorite)
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
                        title={entry.is_favorite ? "Unfavorite" : "Favorite"}
                    >
                        <span className="text-[14px]">{entry.is_favorite ? '❤️' : '🤍'}</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit && onEdit(entry)
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
                    >
                        <span className="text-[12px]">✏️</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete && onDelete(entry.id)
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/10 transition-colors"
                    >
                        <span className="text-[12px]">🗑️</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="text-[14px] leading-relaxed text-white/80">
                {isExpanded ? (
                    <div className="whitespace-pre-wrap">{entry.text}</div>
                ) : (
                    <div>{textPreview}</div>
                )}
                
                {entry.text.length > 200 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsExpanded(!isExpanded)
                        }}
                        className="text-[12px] text-white/40 hover:text-white/60 transition-colors mt-2"
                    >
                        {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>

            {/* Category Badge */}
            {entry.category && (
                <div className="absolute top-4 right-4">
                    <span
                        className="px-2 py-1 text-[10px] rounded-full"
                        style={{
                            background: 'var(--accent-light)',
                            color: 'var(--bg-main)',
                            opacity: 0.8
                        }}
                    >
                        {entry.category}
                    </span>
                </div>
            )}
        </motion.div>
    )
}
