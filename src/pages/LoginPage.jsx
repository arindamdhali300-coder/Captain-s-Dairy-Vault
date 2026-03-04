import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const { signIn, signUp, dummySignIn } = useAuth()
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            if (isSignUp) {
                await signUp(email, password, username)
                setSuccess('Account created! You can now sign in ✨')
                setIsSignUp(false)
            } else {
                if (password === '0000') {
                    // Trigger Stealth Mode
                    dummySignIn(email)
                } else {
                    await signIn(email, password)
                }
            }
        } catch (err) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 bg-deep-dark">
            {/* Ambient Background Glows */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    width: '60vw', height: '60vw',
                    background: 'radial-gradient(circle, rgba(183,110,121,0.1) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    top: '-10%', left: '-10%',
                }}
                animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    width: '70vw', height: '70vw',
                    background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
                    filter: 'blur(100px)',
                    bottom: '-20%', right: '-15%',
                }}
                animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-sm"
            >
                <div
                    className="p-8 sm:p-10 rounded-[28px] glass-card"
                    style={{
                        background: 'linear-gradient(145deg, rgba(20, 16, 18, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%)',
                    }}
                >
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 12, delay: 0.4 }}
                            className="text-6xl mb-4 inline-block"
                        >
                            📓
                        </motion.div>
                        <h1 className="font-script text-5xl sm:text-6xl mb-2 bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-light) 0%, var(--accent-secondary) 50%, var(--accent-light) 100%)' }}
                        >
                            Captain's Diary
                        </h1>
                        <p className="text-[10px] text-white/20 tracking-[4px] uppercase font-body mt-4">
                            Your Stories, Safe Forever
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <AnimatePresence>
                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-1.5 overflow-hidden"
                                    >
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Your Name / Username"
                                            required={isSignUp}
                                            name="username"
                                            id="username"
                                            className="glass-input w-full px-5 py-4 text-[14px]"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-1.5">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    required
                                    name="email"
                                    id="email"
                                    className="glass-input w-full px-5 py-4 text-[14px]"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                name="password"
                                id="password"
                                className="glass-input w-full px-5 py-4 text-[14px]"
                            />
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 rounded-xl text-[12px] text-center"
                                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                                >
                                    {error}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 rounded-xl text-[12px] text-center"
                                    style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}
                                >
                                    {success}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="btn-rose w-full py-4 mt-4 relative overflow-hidden group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                isSignUp ? 'Create Account' : 'Sign In'
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-[13px] text-rose-gold/60 hover:text-rose-gold-light transition-colors"
                        >
                            {isSignUp ? 'Already have an account? Sign in' : "New here? Create an account"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
