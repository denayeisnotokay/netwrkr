const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'title': ['var(--font-lilita)', 'sans-serif'],
      'heading': ['var(--font-signika)', 'sans-serif'],
      'body': ['var(--font-parkinsans)', 'sans-serif'],
    },
  },
  darkMode: "class",
  plugins: [nextui({
    prefix: "nextui", // prefix for themes variables
    addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
    defaultTheme: "light", // default theme from the themes object
    defaultExtendTheme: "light", // default theme to extend on custom themes
    themes: {
      dark: {
        colors: {},
      },
      light: {
        background: "#F8F4EC",
        foreground: "#402B3A",
        colors: {
          default: {
            50: '#F8F4EC',
            100: '#E6DCD4',
            200: '#D3C4BD',
            300: '#C1ABA7',
            400: '#AE9292',
            500: '#9C7F7F',
            600: '#896C70',
            700: '#775A62',
            800: '#654955',
            900: '#523948',
            950: '#402B3A',
          },
          primary: {
            50: '#FFDAF1',
            100: '#FFC8E8',
            200: '#FFB2DD',
            300: '#FF9BD2',
            400: '#FA81C2',
            500: '#F166AE',
            600: '#E44C99',
            700: '#D63484',
            800: '#B41B62',
            900: '#810C3D',
            950: '#3D0319',
          },
          secondary: {
            50: '#DED3FD',
            100: '#BDA4F5',
            200: '#A379ED',
            300: '#8C51E2',
            400: '#7E34D6',
            500: '#7926CA',
            600: '#7426B3',
            700: '#6E299A',
            800: '#612B7D',
            900: '#512962',
            950: '#3B2142',
          },
        },
      },
    },
  }),
  ],
};
