import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MoodPicker from './MoodPicker'
import TagsManager from './TagsManager'
import EntryTemplates from './EntryTemplates'

export default function EntryComposer({ onEntryAdded, editEntry = null, onCloseEdit = null }) {
    const [isOpen, setIsOpen] = useState(false)
    const [text, setText] = useState('')
    const [mood, setMood] = useState('😊')
    const [tags, setTags] = useState([])
    const [category, setCategory] = useState('Personal')
    const [sending, setSending] = useState(false)
    const [showTemplates, setShowTemplates] = useState(false)
    const textRef = useRef(null)

    // Handle initial state for editing
    useEffect(() => {
        if (editEntry) {
            setText(editEntry.text)
            setMood(editEntry.mood)
            setTags(editEntry.tags || [])
            setCategory(editEntry.category || 'Personal')
            setIsOpen(true)
            setTimeout(() => textRef.current?.focus(), 300)
        }
    }, [editEntry])

    const handleOpen = () => {
        setIsOpen(true)
        setTimeout(() => textRef.current?.focus(), 300)
    }

    const handleClose = () => {
        setIsOpen(false)
        setText('')
        setMood('😊')
        setTags([])
        setCategory('Personal')
        if (onCloseEdit) onCloseEdit()
    }

    const handleSelectTemplate = (template) => {
        setText(template.template)
        setMood(template.mood)
        setTags(template.tags || [])
        setCategory(template.category || 'Personal')
        setTimeout(() => textRef.current?.focus(), 300)
    }

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 't' && e.ctrlKey && isOpen && !editEntry) {
                e.preventDefault()
                setShowTemplates(true)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, editEntry])

    const handleSubmit = async () => {
        if (!text.trim() || sending) return
        setSending(true)

        try {
            await onEntryAdded(text, mood, editEntry?.id, tags, category)
            handleClose()
        } catch (error) {
            console.error('Error saving entry:', error)
        } finally {
            setSending(false)
        }
    }

    return (
        <>
            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[8px]"
                        style={{
                            background: 'radial-gradient(circle at center bottom, var(--bg-glow-1), rgba(0,0,0,0.8) 80%)',
                        }}
                        onClick={handleClose}
                    />
                )}
            </AnimatePresence>

            {/* Composer Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6"
                        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
                    >
                        <div
                            className="p-5 max-w-lg mx-auto rounded-[24px] glass-card shadow-2xl"
                            style={{
                                background: 'var(--bg-main)',
                                border: '1px solid var(--glass-border)',
                            }}
                        >
                            {/* Drag handle */}
                            <div className="w-10 h-1 rounded-full mx-auto mb-5 bg-white/10" />

                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-handwriting text-[22px]" style={{ color: 'var(--accent-light)' }}>
                                        {editEntry ? 'Edit Memory...' : 'Dear Diary...'}
                                    </h3>
                                    {!editEntry && (
                                        <button
                                            onClick={() => setShowTemplates(true)}
                                            className="px-3 py-1 rounded-full text-[10px] glass-card hover:bg-white/10 transition-colors flex items-center gap-1"
                                            title="Press Ctrl+T to open templates"
                                        >
                                            📋 Templates
                                        </button>
                                    )}
                                </div>
                                <span className="text-[11px] text-white/15 font-body">
                                    {text.length}/5000
                                </span>
                            </div>

                            {/* Mood Picker */}
                            <div className="mb-4">
                                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2 px-1">How are you feeling?</p>
                                <MoodPicker selectedMood={mood} onSelect={setMood} />
                            </div>

                            {/* Tags Manager */}
                            <div className="mb-4">
                                <TagsManager
                                    tags={tags}
                                    category={category}
                                    onTagsChange={setTags}
                                    onCategoryChange={setCategory}
                                />
                            </div>

                            {/* Text Input */}
                            <div className="relative group mb-5">
                                <textarea
                                    ref={textRef}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Write your thoughts here..."
                                    rows={5}
                                    maxLength={5000}
                                    className="relative w-full px-4 py-4 text-[18px] leading-relaxed resize-none rounded-xl glass-input"
                                    style={{
                                        fontFamily: "var(--script)",
                                        fontSize: '22px'
                                    }}
                                    name="diary-entry-text"
                                    id="diary-entry-text"
                                    autoComplete="off"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
                                    }}
                                />
                            </div>

                            {/* Bottom Bar */}
                            <div className="flex items-center gap-3">
                                <motion.button
                                    onClick={handleClose}
                                    className="px-6 py-3 rounded-xl text-[14px] text-white/30 hover:text-white/50 transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={handleSubmit}
                                    disabled={!text.trim() || sending}
                                    className="btn-rose flex-1 py-3 text-[14px] font-medium rounded-xl disabled:opacity-40"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {sending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </span>
                                    ) : (
                                        editEntry ? '📝 Update Entry' : '📝 Save Memory'
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB */}
            {!editEntry && (
                <motion.button
                    onClick={handleOpen}
                    className="fixed z-30 flex items-center justify-center shadow-xl"
                    style={{
                        width: 64, height: 64,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
                        bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
                        right: '1.5rem',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    animate={isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                >
                    <span className="text-2xl">✍️</span>
                </motion.button>
            )}

            {/* Entry Templates Modal */}
            {showTemplates && (
                <EntryTemplates
                    onSelectTemplate={handleSelectTemplate}
                    onClose={() => setShowTemplates(false)}
                />
            )}
        </>
    )
}
