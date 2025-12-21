/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                domain: {
                    mind: '#6366f1',
                    body: '#10b981',
                    spirit: '#8b5cf6',
                    vocation: '#f59e0b',
                },
                phase: {
                    dissonance: '#ef4444',
                    uncertainty: '#f59e0b',
                    discovery: '#10b981',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
