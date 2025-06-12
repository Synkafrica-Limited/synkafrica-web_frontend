/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Montserrat', 'sans-serif'],
        },
        colors: {
          primary: {
            DEFAULT: "#E0503D",
            50: "#FFF2F1",
            100: "#FFE7E5",
            200: "#FCB6AF",
            300: "#F18A83",
            400: "#E96B56",
            500: "#E0503D",
            600: "#C54334",
            700: "#A1322A",
            800: "#823024",
            900: "#652819",
          },
          secondary: {
            DEFAULT: "#1B52A0",
          },
          gray: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
            900: "#111827",
          },
        },
        boxShadow: {
          base: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
          lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
          xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
          "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
        },
        fontSize: {
          display: ["64px", "72px"],
          h1: ["60px", "72px"],
          h2: ["48px", "58px"],
          h3: ["40px", "48px"],
          h4: ["30px", "38px"],
          h5: ["28px", "40px"],
          h6: ["24px", "30px"],
          body: ["16px", "28px"],
          caption: ["14px", "24px"],
        },
        letterSpacing: {
          caps: '0.1em'
        },
      },
    },
    plugins: [],
  };
  