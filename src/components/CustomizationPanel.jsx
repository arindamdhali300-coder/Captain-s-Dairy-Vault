import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FONTS = [
  { name: 'Caveat', label: 'Handwriting', style: 'cursive' },
  { name: 'Inter', label: 'Modern', style: 'sans-serif' },
  { name: 'Georgia', label: 'Classic', style: 'serif' },
  { name: 'Courier New', label: 'Typewriter', style: 'monospace' }
]

const LAYOUTS = [
  { value: 'card', label: 'Card View', icon: '📄' },
  { value: 'list', label: 'List View', icon: '📋' },
  { value: 'timeline', label: 'Timeline', icon: '📅' }
]

const THEMES = [
  { value: 'midnight-rose', label: 'Midnight Rose', colors: ['#b76e79', '#0a0a0f'] },
  { value: 'vintage-parchment', label: 'Vintage Parchment', colors: ['#8b5e3c', '#f4eee0'] },
  { value: 'emerald-forest', label: 'Emerald Forest', colors: ['#34d399', '#06110a'] },
  { value: 'ocean-breeze', label: 'Ocean Breeze', colors: ['#38bdf8', '#0a111a'] }
]

export default function CustomizationPanel({ isOpen, onClose, preferences, onPreferencesChange }) {
  const [localPreferences, setLocalPreferences] = useState(preferences || {
    theme: 'midnight-rose',
    fontFamily: 'Caveat',
    fontSize: 22,
    layout: 'card',
    autoSave: true
  })

  useEffect(() => {
    setLocalPreferences(preferences || {
      theme: 'midnight-rose',
      fontFamily: 'Caveat',
      fontSize: 22,
      layout: 'card',
      autoSave: true
    })
  }, [preferences])

  const handleSave = () => {
    onPreferencesChange(localPreferences)
    onClose()
  }

  const handleReset = () => {
    setLocalPreferences({
      theme: 'midnight-rose',
      fontFamily: 'Caveat',
      fontSize: 22,
      layout: 'card',
      autoSave: true
    })
  }

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    setLocalPreferences(prev => ({ ...prev, theme }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-script bg-clip-text text-transparent bg-gradient-to-r from-rose-gold to-warm-gold">
                Customize Your Diary
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <label className="block text-[11px] font-body text-white/40 mb-3 uppercase tracking-wider">
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map(theme => (
                    <button
                      key={theme.value}
                      onClick={() => applyTheme(theme.value)}
                      className={`p-3 rounded-lg border transition-all ${
                        localPreferences.theme === theme.value
                          ? 'border-rose-gold bg-rose-gold/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                          {theme.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-white/60">{theme.icon}</span>
                      </div>
                      <div className="text-[11px] text-left">{theme.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Selection */}
              <div>
                <label className="block text-[11px] font-body text-white/40 mb-3 uppercase tracking-wider">
                  Font Style
                </label>
                <div className="space-y-2">
                  {FONTS.map(font => (
                    <label key={font.name} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="font"
                        value={font.name}
                        checked={localPreferences.fontFamily === font.name}
                        onChange={(e) => setLocalPreferences(prev => ({ ...prev, fontFamily: e.target.value }))}
                      />
                      <div className="flex-1">
                        <div className="text-[12px]" style={{ fontFamily: font.style }}>
                          {font.label} Sample Text
                        </div>
                        <div className="text-[10px] text-white/40">{font.name}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-[11px] font-body text-white/40 mb-3 uppercase tracking-wider">
                  Font Size: {localPreferences.fontSize}px
                </label>
                <input
                  type="range"
                  min="16"
                  max="28"
                  value={localPreferences.fontSize}
                  onChange={(e) => setLocalPreferences(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-white/40 mt-1">
                  <span>16px</span>
                  <span>28px</span>
                </div>
              </div>

              {/* Layout Selection */}
              <div>
                <label className="block text-[11px] font-body text-white/40 mb-3 uppercase tracking-wider">
                  Layout
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {LAYOUTS.map(layout => (
                    <button
                      key={layout.value}
                      onClick={() => setLocalPreferences(prev => ({ ...prev, layout: layout.value }))}
                      className={`p-3 rounded-lg border transition-all text-center ${
                        localPreferences.layout === layout.value
                          ? 'border-rose-gold bg-rose-gold/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xl mb-1">{layout.icon}</div>
                      <div className="text-[10px]">{layout.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Save Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-body text-white/40 uppercase tracking-wider">
                  Auto Save
                </label>
                <button
                  onClick={() => setLocalPreferences(prev => ({ ...prev, autoSave: !prev.autoSave }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    localPreferences.autoSave ? 'bg-rose-gold' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      localPreferences.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Preview */}
              <div className="glass-card rounded-lg p-4">
                <div className="text-[10px] text-white/40 mb-2">Preview</div>
                <div
                  className="font-handwriting"
                  style={{
                    fontFamily: localPreferences.fontFamily === 'Caveat' ? 'cursive' : 
                               localPreferences.fontFamily === 'Georgia' ? 'serif' :
                               localPreferences.fontFamily === 'Courier New' ? 'monospace' : 'sans-serif',
                    fontSize: `${localPreferences.fontSize}px`,
                    lineHeight: 1.5
                  }}
                >
                  This is how your diary entries will look with these settings.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-[12px] hover:bg-white/10 transition-colors"
                >
                  Reset to Default
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 btn-rose"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
