# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

# Run

```js
npm run dev
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
<img width="1421" height="709" alt="Screenshot 2026-05-25 at 11 45 34 PM" src="https://github.com/user-attachments/assets/26bd7770-9ee0-418c-90f2-86342eddacd8" />

<img width="1421" height="709" alt="Screenshot 2026-05-25 at 11 53 24 PM" src="https://github.com/user-attachments/assets/52915e92-39db-4e1e-a385-a8e6babcb414" />

<img width="1421" height="709" alt="Screenshot 2026-05-25 at 11 54 01 PM" src="https://github.com/user-attachments/assets/5b7af32d-c0fd-48d8-b149-c6b7e673c682" />

<img width="1421" height="709" alt="Screenshot 2026-05-25 at 11 54 32 PM" src="https://github.com/user-attachments/assets/63fd0943-86f0-4f79-adf8-d09d337c2e64" />

<img width="1421" height="709" alt="Screenshot 2026-05-25 at 11 54 16 PM" src="https://github.com/user-attachments/assets/b3e0353c-436d-4b88-b1ca-d861951cb62d" />
