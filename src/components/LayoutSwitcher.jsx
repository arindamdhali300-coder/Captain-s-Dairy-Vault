import { motion } from 'framer-motion'

export default function LayoutSwitcher({ layout, setLayout }) {
    const layouts = [
        { id: 'card', name: 'Card', icon: '📇' },
        { id: 'list', name: 'List', icon: '📋' },
        { id: 'grid', name: 'Grid', icon: '⚡' },
        { id: 'minimal', name: 'Minimal', icon: '�' }
    ]

    return (
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
            {layouts.map((layoutOption) => (
                <button
                    key={layoutOption.id}
                    onClick={() => setLayout(layoutOption.id)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] transition-all ${
                        layout === layoutOption.id
                            ? 'bg-white/20 text-white'
                            : 'text-white/60 hover:text-white/80'
                    }`}
                    title={layoutOption.name}
                >
                    <span className="text-[12px]">{layoutOption.icon}</span>
                    <span className="hidden sm:inline">{layoutOption.name}</span>
                </button>
            ))}
        </div>
    )
}
