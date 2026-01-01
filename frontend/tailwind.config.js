/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            backgroundImage: {
                radial: "radial-gradient(var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
