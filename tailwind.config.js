/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        cream: "#F2EBE1", slate: "#1C1F27", dusk: "#E8B4A2", peach: "#F3C9B6", alpine: "#8FA3B8", muted: "#A29A93",
        accent: "var(--accent)",
        // aliases — nama lama tetap jalan
        void: "#1C1F27", nebula: "#262A34", starlight: "#F2EBE1", ember: "#E8B4A2", corona: "#F3C9B6", plasma: "#8FA3B8",
        ink: "#1C1F27", "soft-ink": "#262A34", bone: "#F2EBE1", cobalt: "#E8B4A2", violet: "#F3C9B6", warm: "#E0785A",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
