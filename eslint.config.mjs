import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'

const eslintConfig = defineConfig([
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...nextVitals, ...nextTs, prettierRecommended],
    plugins: {
      'better-tailwindcss': betterTailwindcss
    },
    rules: {
      'prettier/prettier': 'off',
      'react-hooks/exhaustive-deps': 'off',
      ...betterTailwindcss.configs.recommended.rules,
      'better-tailwindcss/enforce-consistent-class-order': 'off',
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off'
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: './src/assets/styles/globals.css'
      }
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser
    }
  }
])

export default eslintConfig
