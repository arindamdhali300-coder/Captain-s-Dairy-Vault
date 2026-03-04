import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ExportPanel({ isOpen, onClose, entries }) {
  const [exportFormat, setExportFormat] = useState('json')
  const [dateRange, setDateRange] = useState('all')
  const [selectedTags, setSelectedTags] = useState([])
  const [exporting, setExporting] = useState(false)

  // Get all unique tags from entries
  const allTags = [...new Set(entries.flatMap(entry => entry.tags || []))]

  const filterEntries = () => {
    let filtered = [...entries]

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      filtered = filtered.filter(entry => new Date(entry.created_at) >= filterDate)
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(entry => 
        entry.tags && selectedTags.some(tag => entry.tags.includes(tag))
      )
    }

    return filtered
  }

  const handleExport = async () => {
    setExporting(true)
    const filteredEntries = filterEntries()
    
    try {
      let content = ''
      let filename = ''
      let mimeType = ''

      switch (exportFormat) {
        case 'json':
          content = JSON.stringify(filteredEntries, null, 2)
          filename = `captain-diary-${new Date().toISOString().split('T')[0]}.json`
          mimeType = 'application/json'
          break

        case 'markdown':
          content = filteredEntries.map(entry => {
            const date = new Date(entry.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric'
            })
            const tags = entry.tags ? `#${entry.tags.join(' #')}` : ''
            return `# ${date} ${entry.mood}\n\n${entry.text}\n\n${tags}\n---\n`
          }).join('\n')
          filename = `captain-diary-${new Date().toISOString().split('T')[0]}.md`
          mimeType = 'text/markdown'
          break

        case 'txt':
          content = filteredEntries.map(entry => {
            const date = new Date(entry.created_at).toLocaleDateString('en-IN')
            return `${date} ${entry.mood}\n${entry.text}\n${'='.repeat(50)}\n`
          }).join('\n')
          filename = `captain-diary-${new Date().toISOString().split('T')[0]}.txt`
          mimeType = 'text/plain'
          break
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      onClose()
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
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
            className="glass-card rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-script bg-clip-text text-transparent bg-gradient-to-r from-rose-gold to-warm-gold">
                Export Your Memories
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Export Format */}
              <div>
                <label className="block text-[11px] font-body text-white/40 mb-2 uppercase tracking-wider">
                  Format
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'json', label: 'JSON', desc: 'Full data with metadata' },
                    { value: 'markdown', label: 'Markdown', desc: 'For documentation' },
                    { value: 'txt', label: 'Plain Text', desc: 'Simple text format' }
                  ].map(format => (
                    <label key={format.value} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        value={format.value}
                        checked={exportFormat === format.value}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-[12px] font-body">{format.label}</div>
                        <div className="text-[10px] text-white/40">{format.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-[11px] font-body text-white/40 mb-2 uppercase tracking-wider">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 text-[12px] glass-input rounded-lg"
                >
                  <option value="all">All entries</option>
                  <option value="week">Last week</option>
                  <option value="month">Last month</option>
                  <option value="year">Last year</option>
                </select>
              </div>

              {/* Tag Filter */}
              {allTags.length > 0 && (
                <div>
                  <label className="block text-[11px] font-body text-white/40 mb-2 uppercase tracking-wider">
                    Filter by Tags (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <label key={tag} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTags([...selectedTags, tag])
                            } else {
                              setSelectedTags(selectedTags.filter(t => t !== tag))
                            }
                          }}
                          className="w-3 h-3"
                        />
                        <span className="text-[10px] text-rose-gold">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Stats */}
              <div className="glass-card rounded-lg p-3">
                <div className="text-[11px] text-white/60">
                  Will export {filterEntries().length} entries
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={exporting || filterEntries().length === 0}
                className="w-full btn-rose disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exporting ? 'Exporting...' : `Export ${exportFormat.toUpperCase()}`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
