import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AdminProvider, useAdmin } from './context/AdminContext'
import { ThemeProvider } from './context/ThemeContext'
import LoginPage from './pages/LoginPage'
import DiaryFeed from './pages/DiaryFeed'
import AdminFeed from './pages/AdminFeed'

function AppContent() {
    const { user, loading } = useAuth()
    const { isAdmin } = useAdmin()

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-transparent overflow-hidden" style={{ background: 'var(--bg-main)' }}>
                {/* Ambient background glows */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute w-[500px] h-[500px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, var(--bg-glow-1) 0%, transparent 70%)',
                            top: '20%', left: '10%',
                            filter: 'blur(60px)',
                        }}
                        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute w-[400px] h-[400px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, var(--bg-glow-2) 0%, transparent 70%)',
                            bottom: '15%', right: '5%',
                            filter: 'blur(50px)',
                        }}
                        animate={{ x: [0, -25, 0], y: [0, 15, 0], scale: [1, 1.15, 1] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center relative z-10"
                >
                    <motion.div
                        className="relative mx-auto mb-6 flex items-center justify-center p-4 rounded-full glass-card"
                        style={{ width: 80, height: 80 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                        <span className="text-4xl">📓</span>
                    </motion.div>

                    <h1 className="font-script text-4xl bg-clip-text text-transparent"
                        style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent-secondary) 50%, var(--accent-light) 100%)' }}
                    >
                        Captain's Diary
                    </h1>

                    <p className="text-[10px] text-white/30 tracking-[4px] uppercase font-body mt-4 animate-pulse">
                        Opening your pages...
                    </p>
                </motion.div>
            </div>
        )
    }

    return (
        <AnimatePresence mode="wait">
            {user ? (
                <motion.div
                    key="diary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-screen"
                >
                    {isAdmin ? <AdminFeed /> : <DiaryFeed />}
                </motion.div>
            ) : (
                <motion.div
                    key="login"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-screen"
                >
                    <LoginPage />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default function App() {
    return (
        <ThemeProvider>
            <AdminProvider>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </AdminProvider>
        </ThemeProvider>
    )
}
