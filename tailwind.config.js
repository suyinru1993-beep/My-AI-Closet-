/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#000000",
                "on-primary": "#ffffff",
                "secondary-container": "#e5e2dd",
                "on-secondary-container": "#656461",
                "background": "#f9f9f9",
                "surface": "#f9f9f9",
                "on-surface": "#1a1c1c",
                "on-surface-variant": "#444748",
                "outline": "#747878",
                "outline-variant": "#c4c7c7",
                "tertiary": "#8ba88e", /* Sage from Design MD */
                "error": "#ba1a1a",
            },
            fontFamily: {
                display: ["Bodoni Moda", "serif"],
                body: ["Inter", "sans-serif"],
            },
            spacing: {
                unit: "8px",
                "stack-sm": "16px",
                "stack-md": "32px",
                "stack-lg": "64px",
                gutter: "24px",
                "container-padding-mobile": "20px",
                "container-padding-desktop": "48px",
            },
            borderRadius: {
                lg: "0.5rem",
                xl: "0.75rem",
            }
        },
    },
    plugins: [],
}
