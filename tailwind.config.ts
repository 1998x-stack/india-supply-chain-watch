import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {extend:{colors:{ink:"#152a39", navy:"#102d40",brand:"#087f75",soft:"#edf6f3", gold:"#d39852"},boxShadow:{soft:"0 14px 55px rgba(22,48,62,.08)"}}},
  plugins: []
} satisfies Config;
