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
            },
            colors: {
                paper: '#F9F8F4',
                ink: '#2C2C2C',
                sub: '#5A5A5A',
                accent: '#8C7B6C', /* Soft Brown */
            }
        }
    },
    plugins: [],
}
