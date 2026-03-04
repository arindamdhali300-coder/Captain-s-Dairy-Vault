import { motion, AnimatePresence } from 'framer-motion'
import { useTheme, THEMES } from '../context/ThemeContext'

export default function ThemeSwitcher({ isOpen, onClose }) {
    const { currentTheme, setTheme } = useTheme()

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-black/20 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 z-[71] w-full max-w-[300px] glass-card shadow-2xl overflow-y-auto"
                        style={{
                            borderRadius: '24px 0 0 24px',
                            background: 'var(--bg-main)',
                            borderLeft: '1px solid var(--glass-border)'
                        }}
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="font-script text-3xl text-rose-gold-light">Themes</h2>
                                <button onClick={onClose} className="p-2 text-white/20 hover:text-white/40 transition-colors">
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                {THEMES.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setTheme(theme.id)}
                                        className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border ${currentTheme === theme.id
                                                ? 'bg-white/10 border-white/20 scale-[1.02]'
                                                : 'bg-white/5 border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                                            style={{ background: theme.colors.bg, border: `1px solid ${theme.colors.primary}44` }}
                                        >
                                            {theme.icon}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[14px] font-medium text-white/80">{theme.name}</p>
                                            <div className="flex gap-1 mt-1">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                                                <div className="w-3 h-3 rounded-full opacity-30" style={{ backgroundColor: theme.colors.primary }} />
                                            </div>
                                        </div>
                                        {currentTheme === theme.id && (
                                            <motion.div layoutId="active-theme" className="ml-auto text-rose-gold">
                                                ✨
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-12 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                                <p className="text-[11px] text-white/20 uppercase tracking-widest text-center">
                                    More themes coming soon
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
