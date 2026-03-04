import { motion } from 'framer-motion'

export const MOODS = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '🥰', label: 'Loved' },
    { emoji: '🤔', label: 'Pensive' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '😎', label: 'Cool' },
    { emoji: '🩹', label: 'Healing' },
]

export default function MoodPicker({ selectedMood, onSelect }) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
            {MOODS.map((mood) => (
                <motion.button
                    key={mood.emoji}
                    type="button"
                    onClick={() => onSelect(mood.emoji)}
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all"
                    style={{
                        background: selectedMood === mood.emoji
                            ? 'rgba(183, 110, 121, 0.2)'
                            : 'rgba(255, 255, 255, 0.04)',
                        border: selectedMood === mood.emoji
                            ? '1px solid rgba(183, 110, 121, 0.4)'
                            : '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                    whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.08)' }}
                    whileTap={{ scale: 0.9 }}
                >
                    {mood.emoji}
                </motion.button>
            ))}
        </div>
    )
}
