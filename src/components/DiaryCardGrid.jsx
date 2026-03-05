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

export default function DiaryCardGrid({ entry, index, onDelete, onToggleFavorite, onEdit }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const textPreview = entry.text.length > 150 ? entry.text.substring(0, 150) + '...' : entry.text

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="glass-card p-4 rounded-lg cursor-pointer hover:scale-[1.02] transition-all h-full flex flex-col"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{entry.mood}</span>
                    <div className="text-[10px] text-white/40">
                        {formatDiaryDate(entry.created_at)}
                    </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleFavorite(entry.id, entry.is_favorite)
                        }}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
                    >
                        <span className="text-[10px]">{entry.is_favorite ? '❤️' : '🤍'}</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit && onEdit(entry)
                        }}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
                    >
                        <span className="text-[9px]">✏️</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete && onDelete(entry.id)
                        }}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500/10 transition-colors"
                    >
                        <span className="text-[9px]">🗑️</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-[12px] leading-relaxed text-white/80">
                {isExpanded ? (
                    <div className="whitespace-pre-wrap">{entry.text}</div>
                ) : (
                    <div>{textPreview}</div>
                )}
                
                {entry.text.length > 150 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsExpanded(!isExpanded)
                        }}
                        className="text-[10px] text-white/40 hover:text-white/60 transition-colors mt-1"
                    >
                        {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>

            {/* Footer */}
            <div className="mt-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {entry.tags.slice(0, 2).map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-1 py-0.5 text-[8px] rounded-full"
                                    style={{
                                        background: 'var(--accent)',
                                        color: 'white',
                                        opacity: 0.7
                                    }}
                                >
                                    #{tag}
                                </span>
                            ))}
                            {entry.tags.length > 2 && (
                                <span className="text-[8px] text-white/40">+{entry.tags.length - 2}</span>
                            )}
                        </div>
                    )}
                    
                    {/* Category */}
                    {entry.category && (
                        <span
                            className="px-2 py-0.5 text-[8px] rounded-full"
                            style={{
                                background: 'var(--accent-light)',
                                color: 'var(--bg-main)',
                                opacity: 0.8
                            }}
                        >
                            {entry.category}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
