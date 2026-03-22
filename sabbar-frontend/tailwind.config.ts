import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Nouvelle palette SABBAR
        'sabbar': {
          50: '#F0F6F8',
          100: '#E1EDF1',
          200: '#C3DCE2',
          300: '#A5CBD4',
          400: '#87BAC6',
          500: '#69A9B8',
          600: '#4B98AA',
          700: '#34495E',    // Accent gris bleuté
          800: '#2D3E50',    // Indigo foncé
          900: '#1E2A37',    // Indigo très foncé
        },
        'turquoise': {
          50: '#F0FDFB',
          100: '#E0FBFD',
          200: '#B3F3F9',
          300: '#86EBF5',
          400: '#59E3F1',
          500: '#2CDBEE',
          600: '#1ABC9C',    // Turquoise vif (SECONDAIRE)
          700: '#16A085',
          800: '#118471',
          900: '#0C5C5D',
        },
        'fond': {
          50: '#ECF0F1',     // Gris clair (FOND)
          100: '#D5DBDD',
          200: '#ABBABA',
          300: '#819898',
          400: '#577677',
          500: '#2D5455',
        },
        'texte': {
          primary: '#2C3E50',   // Noir bleu
          secondary: '#34495E', // Gris bleuté
          light: '#7F8C8D',
          lighter: '#95A5A6',
        }
      },
      backgroundColor: {
        'primary': '#2D3E50',
        'secondary': '#1ABC9C',
        'accent': '#34495E',
        'light': '#ECF0F1',
      },
      textColor: {
        'primary': '#2C3E50',
        'secondary': '#34495E',
        'accent': '#1ABC9C',
      },
      borderColor: {
        'primary': '#2D3E50',
        'secondary': '#1ABC9C',
        'accent': '#34495E',
      }
    },
  },
  plugins: [],
}

export default config