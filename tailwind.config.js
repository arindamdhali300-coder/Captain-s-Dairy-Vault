/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'rose-gold': '#b76e79',
                'rose-gold-light': '#e6b8c0',
                'warm-gold': '#d4af37',
                'velvet': '#4a2c31',
                'deep-dark': '#0a0a0f',
                'dark-card': 'rgba(255, 255, 255, 0.05)',
                'dark-card-hover': 'rgba(255, 255, 255, 0.08)',
            },
            fontFamily: {
                'script': ['Pinyon Script', 'cursive'],
                'body': ['Inter', 'sans-serif'],
                'handwriting': ['Caveat', 'cursive'],
            },
            backdropBlur: {
                'glass': '20px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow-pulse': 'glowPulse 3s ease-in-out infinite',
                'slide-up': 'slideUp 0.6s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(5deg)' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(183, 110, 121, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(183, 110, 121, 0.6)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
