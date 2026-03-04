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

export default function DiaryCard({ entry, index, onDelete, onToggleFavorite, onEdit }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const tilt = ((index % 5) - 2) * 0.3

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30, rotateZ: tilt * 2 }}
            animate={{ opacity: 1, y: 0, rotateZ: tilt }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.4) }}
            className="diary-page relative group"
        >
            {/* Spiral holes */}
            <div className="diary-page-holes">
                {[1, 2, 3, 4].map((h) => <div key={h} className="diary-hole" />)}
            </div>

            {/* Corner fold */}
            <div className="absolute bottom-0 right-0 w-6 h-6 z-10"
                style={{
                    background: 'linear-gradient(135deg, var(--paper-bg) 45%, var(--paper-dark) 50%, rgba(0,0,0,0.1) 100%)',
                    borderTopLeftRadius: 6,
                    boxShadow: '-2px -2px 5px rgba(0,0,0,0.04)',
                }}
            />

            {/* Actions Bar */}
            <div className="absolute top-3 right-4 z-20 flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onToggleFavorite}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
                    title={entry.is_favorite ? "Unfavorite" : "Favorite"}
                >
                    <span className="text-[14px]">{entry.is_favorite ? '❤️' : '🤍'}</span>
                </button>
                <button
                    onClick={() => onEdit && onEdit(entry)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
                >
                    <span className="text-[12px]">✏️</span>
                </button>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/10 transition-colors"
                >
                    <span className="text-[12px]">🗑️</span>
                </button>
            </div>

            {/* Mood Badge */}
            <div className="absolute -left-1 top-6 z-20 w-8 h-8 rounded-full flex items-center justify-center text-xl filter drop-shadow-sm rotate-[-12deg]">
                {entry.mood}
            </div>

            {/* ... Modal stays same */}

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 pr-20">
                    <span className="font-handwriting text-[20px] font-bold" style={{ color: 'var(--accent)' }}>
                        {formatDiaryDate(entry.created_at)}
                    </span>
                    <div className="flex items-center gap-2">
                        {entry.updated_at !== entry.created_at && (
                            <span className="text-[9px] uppercase tracking-widest opacity-30">Edited</span>
                        )}
                        <span className="text-[10px] font-body opacity-30">
                            {formatTime(entry.created_at)}
                        </span>
                    </div>
                </div>

                <div className="h-[1px] w-48 mb-4 opacity-20" style={{ background: 'linear-gradient(to right, var(--accent), transparent)' }} />

                <div className="font-handwriting text-[20px] sm:text-[22px] leading-[32px] whitespace-pre-wrap break-words text-justify" style={{ color: 'var(--ink-color)', textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.1)' }}>
                    {entry.text.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0 indent-8 first:indent-0">
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Tags and Category */}
                <div className="mt-4 pt-3 border-t border-paper-line/30">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] uppercase tracking-widest opacity-30" style={{ color: 'var(--accent)' }}>
                            {entry.category || 'Personal'}
                        </span>
                    </div>
                    {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {entry.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="inline-block px-2 py-0.5 text-[8px] rounded-full opacity-60"
                                    style={{
                                        backgroundColor: 'var(--paper-margin)',
                                        color: 'var(--ink-color)'
                                    }}
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 max-w-sm mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-white text-lg font-semibold mb-2">Delete Entry?</h3>
                            <p className="text-white/70 text-sm mb-6">
                                This action cannot be undone. Are you sure you want to delete this memory?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false)
                                        onDelete && onDelete(entry.id)
                                    }}
                                    className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Torn Edge Effect */}
            <div className="diary-torn-edge" />
        </motion.div>
    )
}
