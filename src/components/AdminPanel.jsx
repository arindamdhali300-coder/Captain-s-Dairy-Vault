import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'

export default function AdminPanel({ isOpen, onClose }) {
  const { allEntries, loading, deleteAnyEntry, getStats } = useAdmin()
  const [selectedUser, setSelectedUser] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('entries') // 'entries' or 'stats'

  const stats = getStats()
  
  // Get unique users for filtering
  const uniqueUsers = [...new Set(allEntries.map(entry => entry.auth.users?.email).filter(Boolean))]
  
  // Filter entries
  const filteredEntries = allEntries.filter(entry => {
    const matchesUser = selectedUser === 'all' || entry.auth.users?.email === selectedUser
    const matchesSearch = searchTerm === '' || 
      entry.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.auth.users?.email && entry.auth.users.email.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesUser && matchesSearch
  })

  const handleDeleteEntry = async (entryId) => {
    if (confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      const result = await deleteAnyEntry(entryId)
      if (result.success) {
        alert('Entry deleted successfully')
      } else {
        alert('Error deleting entry: ' + result.error)
      }
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
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
        className="glass-card rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <h2 className="text-xl font-script bg-clip-text text-transparent bg-gradient-to-r from-rose-gold to-warm-gold">
              Admin Panel
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            ×
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('entries')}
            className={`px-4 py-2 rounded-lg text-[12px] transition-colors ${
              viewMode === 'entries'
                ? 'bg-rose-gold/20 text-rose-gold border border-rose-gold/30'
                : 'glass-card text-white/60 hover:text-white/80'
            }`}
          >
            📝 Entries ({allEntries.length})
          </button>
          <button
            onClick={() => setViewMode('stats')}
            className={`px-4 py-2 rounded-lg text-[12px] transition-colors ${
              viewMode === 'stats'
                ? 'bg-rose-gold/20 text-rose-gold border border-rose-gold/30'
                : 'glass-card text-white/60 hover:text-white/80'
            }`}
          >
            📊 Statistics
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'stats' ? (
            <StatsView stats={stats} />
          ) : (
            <EntriesView
              entries={filteredEntries}
              loading={loading}
              uniqueUsers={uniqueUsers}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleDeleteEntry={handleDeleteEntry}
              formatDate={formatDate}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function StatsView({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="glass-card rounded-lg p-4">
        <div className="text-2xl mb-2">📝</div>
        <div className="text-2xl font-bold text-rose-gold">{stats.totalEntries}</div>
        <div className="text-[11px] text-white/60">Total Entries</div>
      </div>
      
      <div className="glass-card rounded-lg p-4">
        <div className="text-2xl mb-2">👥</div>
        <div className="text-2xl font-bold text-rose-gold">{stats.totalUsers}</div>
        <div className="text-[11px] text-white/60">Total Users</div>
      </div>
      
      <div className="glass-card rounded-lg p-4">
        <div className="text-2xl mb-2">❤️</div>
        <div className="text-2xl font-bold text-rose-gold">{stats.totalFavorites}</div>
        <div className="text-[11px] text-white/60">Favorite Entries</div>
      </div>
      
      <div className="glass-card rounded-lg p-4">
        <div className="text-2xl mb-2">📖</div>
        <div className="text-2xl font-bold text-rose-gold">{stats.totalWords.toLocaleString()}</div>
        <div className="text-[11px] text-white/60">Total Words</div>
      </div>
      
      <div className="glass-card rounded-lg p-4">
        <div className="text-2xl mb-2">📊</div>
        <div className="text-2xl font-bold text-rose-gold">{stats.avgWordsPerEntry}</div>
        <div className="text-[11px] text-white/60">Avg Words/Entry</div>
      </div>
      
      <div className="glass-card rounded-lg p-4">
        <div className="text-2xl mb-2">🔥</div>
        <div className="text-2xl font-bold text-rose-gold">{stats.recentActivity}</div>
        <div className="text-[11px] text-white/60">Last 7 Days</div>
      </div>

      {/* Mood Distribution */}
      <div className="glass-card rounded-lg p-4 md:col-span-2">
        <div className="text-[12px] font-medium mb-3 text-white/80">Mood Distribution</div>
        <div className="space-y-2">
          {Object.entries(stats.moodCounts).map(([mood, count]) => (
            <div key={mood} className="flex items-center justify-between">
              <span className="text-[16px]">{mood}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-gold rounded-full"
                    style={{ width: `${(count / stats.totalEntries) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-white/60 w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="glass-card rounded-lg p-4">
        <div className="text-[12px] font-medium mb-3 text-white/80">Categories</div>
        <div className="space-y-2">
          {Object.entries(stats.categoryCounts).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-[11px]">{category}</span>
              <span className="text-[11px] text-rose-gold">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EntriesView({ entries, loading, uniqueUsers, selectedUser, setSelectedUser, searchTerm, setSearchTerm, handleDeleteEntry, formatDate }) {
  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search entries or users..."
            className="w-full px-3 py-2 text-[12px] glass-input rounded-lg"
          />
        </div>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="px-3 py-2 text-[12px] glass-input rounded-lg min-w-48"
        >
          <option value="all">All Users ({uniqueUsers.length})</option>
          {uniqueUsers.map(email => (
            <option key={email} value={email}>{email}</option>
          ))}
        </select>
      </div>

      {/* Entries List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[16px]">{entry.mood}</span>
                    <span className="text-[11px] text-rose-gold">{entry.category || 'Personal'}</span>
                    {entry.is_favorite && <span className="text-[12px]">❤️</span>}
                  </div>
                  <div className="text-[11px] text-white/40 mb-2">
                    {entry.auth.users?.email || 'Unknown User'} • {formatDate(entry.created_at)}
                  </div>
                  <div className="text-[12px] text-white/80 line-clamp-3">
                    {entry.text}
                  </div>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.tags.map(tag => (
                        <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-rose-gold/10 text-rose-gold/60">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="ml-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors text-red-400"
                  title="Delete entry"
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          ))}
          
          {entries.length === 0 && (
            <div className="text-center py-8 text-white/40">
              <div className="text-4xl mb-2">📭</div>
              <div className="text-[12px]">No entries found</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
