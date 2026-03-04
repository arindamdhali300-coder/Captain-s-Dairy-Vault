import { useState } from 'react'
import { motion } from 'framer-motion'

const PREDEFINED_TAGS = [
  'Work', 'Personal', 'Travel', 'Family', 'Friends', 'Health', 
  'Goals', 'Ideas', 'Gratitude', 'Reflection', 'Dreams', 'Memories',
  'Learning', 'Achievements', 'Challenges', 'Celebration'
]

const CATEGORIES = ['Personal', 'Work', 'Travel', 'Health', 'Creative', 'Spiritual']

export default function TagsManager({ tags = [], category = 'Personal', onTagsChange, onCategoryChange }) {
  const [newTag, setNewTag] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleAddTag = (tag) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag])
      setNewTag('')
      setShowSuggestions(false)
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const filteredSuggestions = PREDEFINED_TAGS.filter(
    tag => tag.toLowerCase().includes(newTag.toLowerCase()) && !tags.includes(tag)
  )

  return (
    <div className="space-y-4">
      {/* Category Selector */}
      <div>
        <label className="block text-[11px] font-body text-white/40 mb-2 uppercase tracking-wider">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-body transition-all ${
                category === cat
                  ? 'bg-rose-gold/20 text-rose-gold border border-rose-gold/30'
                  : 'glass-card text-white/60 hover:text-white/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Input */}
      <div>
        <label className="block text-[11px] font-body text-white/40 mb-2 uppercase tracking-wider">
          Tags
        </label>
        <div className="relative">
          <input
            type="text"
            value={newTag}
            onChange={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                const tag = e.target.value.trim()
                if (tag && !tags.includes(tag)) {
                  onTagsChange([...tags, tag])
                  setNewTag('')
                }
              } else {
                setNewTag(e.target.value)
                setShowSuggestions(e.target.value.length > 0)
              }
            }}
            onFocus={() => setShowSuggestions(newTag.length > 0)}
            onBlur={() => setShowSuggestions(false)}
            placeholder="Add tags..."
            name="new-tag"
            id="new-tag"
            className="w-full px-3 py-2 text-[12px] glass-input rounded-lg"
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-1 glass-card rounded-lg shadow-lg z-50 max-h-32 overflow-y-auto"
            >
              {filteredSuggestions.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleAddTag(tag)}
                  className="w-full text-left px-3 py-2 text-[11px] hover:bg-white/10 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Selected Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <motion.div
              key={tag}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-gold/10 border border-rose-gold/20"
            >
              <span className="text-[10px] text-rose-gold">{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-rose-gold/60 hover:text-rose-gold text-[10px] leading-none"
              >
                ×
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
