import { useState } from 'react'
import { motion } from 'framer-motion'

const TEMPLATES = [
  {
    id: 'daily-reflection',
    name: 'Daily Reflection',
    icon: '🌅',
    category: 'Personal',
    mood: '😊',
    tags: ['Reflection', 'Daily'],
    template: `Today I'm grateful for:
• 

Something that challenged me today:
• 

What I learned about myself:
• 

Tomorrow I want to focus on:
• 

Overall feeling: `
  },
  {
    id: 'gratitude-journal',
    name: 'Gratitude Journal',
    icon: '🙏',
    category: 'Personal',
    mood: '😇',
    tags: ['Gratitude', 'Positive'],
    template: `Three things I'm grateful for today:
1. 
2. 
3. 

Why these matter to me:

A moment of joy I experienced:

Someone who made my day better:

`
  },
  {
    id: 'work-review',
    name: 'Work Day Review',
    icon: '💼',
    category: 'Work',
    mood: '💪',
    tags: ['Work', 'Productivity'],
    template: `Today's accomplishments:
• 

Challenges I faced and how I handled them:
• 

What I learned professionally:
• 

Goals for tomorrow:
• 

Work-life balance thoughts:

`
  },
  {
    id: 'mood-check-in',
    name: 'Mood Check-in',
    icon: '💭',
    category: 'Personal',
    mood: '🤔',
    tags: ['Mood', 'Emotional'],
    template: `Current mood: 

What's influencing my mood:
• 

Physical state (energy, sleep, health):

Mental state (stress, clarity, focus):

Three things that would improve my mood:
1. 
2. 
3. 

`
  },
  {
    id: 'goal-setting',
    name: 'Goal Setting',
    icon: '🎯',
    category: 'Goals',
    mood: '🚀',
    tags: ['Goals', 'Planning'],
    template: `My big picture goal:

Why this goal matters to me:

Small steps I can take this week:
• 

Potential obstacles and how to overcome them:

How I'll celebrate progress:

Accountability partner or system:

`
  },
  {
    id: 'travel-memory',
    name: 'Travel Memory',
    icon: '✈️',
    category: 'Travel',
    mood: '🌍',
    tags: ['Travel', 'Memories'],
    template: `Location: 

Date: 

What made this place special:

People I met or experiences I had:

Food I tried:

Something unexpected that happened:

What this trip taught me:

Would I return? Why or why not:

`
  },
  {
    id: 'relationship-reflection',
    name: 'Relationship Reflection',
    icon: '💕',
    category: 'Personal',
    mood: '❤️',
    tags: ['Relationships', 'Reflection'],
    template: `Relationship I'm thinking about:

What I appreciate about this person:

A recent meaningful moment together:

Something I'd like to improve:

How I can show I care:

My hopes for this relationship:

`
  },
  {
    id: 'creative-idea',
    name: 'Creative Idea',
    icon: '💡',
    category: 'Creative',
    mood: '🎨',
    tags: ['Creative', 'Ideas'],
    template: `My idea:

What inspired it:

How it could work:

Potential challenges:

Next steps to explore it:

Why I'm excited about this:

`
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    icon: '🏃',
    category: 'Health',
    mood: '💪',
    tags: ['Health', 'Wellness'],
    template: `Today's movement/exercise:

How I nourished my body:

My energy levels:

Sleep quality last night:

Mental health check-in:

One healthy choice I'm proud of:

Tomorrow's health intention:

`
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    icon: '🧩',
    category: 'Personal',
    mood: '🤔',
    tags: ['Problem-solving', 'Solutions'],
    template: `The problem I'm facing:

Why it matters to me:

Possible solutions I've considered:
• 

Pros and cons of each approach:

My decision and why:

Next steps to implement:

What I learned from this process:

`
  }
]

export default function EntryTemplates({ onSelectTemplate, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const categories = ['All', ...new Set(TEMPLATES.map(t => t.category))]
  
  const filteredTemplates = selectedCategory === 'All' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory)

  const handleSelectTemplate = (template) => {
    onSelectTemplate(template)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-script bg-clip-text text-transparent bg-gradient-to-r from-rose-gold to-warm-gold">
            Choose a Template
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-[11px] font-body transition-all ${
                selectedCategory === category
                  ? 'bg-rose-gold/20 text-rose-gold border border-rose-gold/30'
                  : 'glass-card text-white/60 hover:text-white/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <motion.button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className="text-left p-4 glass-card rounded-xl hover:bg-white/10 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{template.icon}</span>
                  <div>
                    <h3 className="font-body text-[13px] font-medium text-white/90 group-hover:text-white">
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-rose-gold/60">{template.category}</span>
                      <span className="text-[10px]">{template.mood}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-[10px] text-white/40 line-clamp-3 font-mono">
                  {template.template.split('\n').slice(0, 3).join(' ').substring(0, 100)}...
                </div>

                {template.tags && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[8px] px-2 py-0.5 rounded-full bg-rose-gold/10 text-rose-gold/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="text-[11px] text-white/40 text-center">
            Templates help you start writing with structure and purpose
          </div>
        </div>
      </motion.div>
    </div>
  )
}
