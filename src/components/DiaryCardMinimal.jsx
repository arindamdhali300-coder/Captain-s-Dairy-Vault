import { useState } from 'react'
import { motion } from 'framer-motion'
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

    return `${date.getDate()} ${months[date.getMonth()]}`
}

export default function DiaryCardMinimal({ entry, index, onDelete, onToggleFavorite, onEdit }) {
    const textPreview = entry.text.length > 100 ? entry.text.substring(0, 100) + '...' : entry.text

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02, duration: 0.2 }}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer group"
            onClick={() => onEdit && onEdit(entry)}
        >
            {/* Mood */}
            <div className="text-2xl flex-shrink-0">{entry.mood}</div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <div className="text-[11px] text-white/40">
                        {formatDiaryDate(entry.created_at)}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onToggleFavorite(entry.id, entry.is_favorite)
                            }}
                            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
                        >
                            <span className="text-[8px]">{entry.is_favorite ? '❤️' : '🤍'}</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete && onDelete(entry.id)
                            }}
                            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-500/10 transition-colors"
                        >
                            <span className="text-[8px]">🗑️</span>
                        </button>
                    </div>
                </div>
                
                <div className="text-[12px] text-white/70 truncate">
                    {textPreview}
                </div>
                
                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                        {entry.tags.slice(0, 3).map((tag, i) => (
                            <span
                                key={i}
                                className="px-1 py-0.5 text-[8px] rounded-full"
                                style={{
                                    background: 'var(--accent)',
                                    color: 'white',
                                    opacity: 0.6
                                }}
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}
