import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AdminContext = createContext()

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail] = useState('dp7800549@gmail.com')
  const [allEntries, setAllEntries] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email === adminEmail) {
        setIsAdmin(true)
        fetchAllEntries()
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
    }
  }

  const fetchAllEntries = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select(`
          *,
          auth.users!user_id (
            email,
            user_metadata
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAllEntries(data || [])
    } catch (error) {
      console.error('Error fetching all entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteAnyEntry = async (entryId) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', entryId)

      if (error) throw error
      await fetchAllEntries()
      return { success: true }
    } catch (error) {
      console.error('Error deleting entry:', error)
      return { success: false, error: error.message }
    }
  }

  const getStats = () => {
    const totalEntries = allEntries.length
    const totalUsers = [...new Set(allEntries.map(e => e.user_id))].length
    const totalFavorites = allEntries.filter(e => e.is_favorite).length
    const totalWords = allEntries.reduce((acc, curr) => acc + curr.text.trim().split(/\s+/).length, 0)

    // Mood distribution
    const moodCounts = allEntries.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1
      return acc
    }, {})

    // Category distribution
    const categoryCounts = allEntries.reduce((acc, curr) => {
      acc[curr.category || 'Personal'] = (acc[curr.category || 'Personal'] || 0) + 1
      return acc
    }, {})

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentEntries = allEntries.filter(e => new Date(e.created_at) >= sevenDaysAgo)

    return {
      totalEntries,
      totalUsers,
      totalFavorites,
      totalWords,
      moodCounts,
      categoryCounts,
      recentActivity: recentEntries.length,
      avgWordsPerEntry: totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0
    }
  }

  const value = {
    isAdmin,
    adminEmail,
    allEntries,
    loading,
    fetchAllEntries,
    deleteAnyEntry,
    getStats,
    checkAdminStatus
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}
