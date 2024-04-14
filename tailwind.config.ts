import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");


const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"

  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        darkBlue: '#000033',
        lightBlue: '#00ccff'
      },
      darkMode: "class",
      plugins: [
        nextui({
          layout: { 
          spacingUnit: 2,
          }
        })],
       fontFamily: {
        carlson : ['Carlson', 'sans-serif'],
        serif : ['PT-Serif', 'serif'],  
        mutuka: ['Mukta', 'sans-serif'],
        lora: ['Lora','serif'],
        roboto: ['Roboto', 'sans-serif'],
        rockwell: ['Rockwell', 'serif'],
        inter: ['Inter', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
       },
        screens: {
            xs: "480px",
            ss: "620px",
            sm: "768px",
            md: "1060px",
            lg: "1200px",
            xl: "1700px",
          },
    },
  },
  plugins: [],
};
export default config;
