/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Pretendard', 'sans-serif'],
                serif: ['"Playfair Display"', '"Noto Serif KR"', 'serif'],
                'handwriting-kr': ['"Gowun Batang"', 'serif'],
                'handwriting-en': ['"Gowun Batang"', 'serif'],
            },
            colors: {
                paper: '#F9F8F4',
                'paper-line': '#e5e7eb', // Light gray for lines
                ink: '#2C2C2C',
                sub: '#5A5A5A',
                accent: '#8C7B6C', /* Soft Brown */
                highlighter: 'rgba(255, 255, 0, 0.3)', // Translucent yellow
            }
        }
    },
    plugins: [],
}
