import antfu from '@antfu/eslint-config';
import nextPlugin from '@next/eslint-plugin-next';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tailwind from 'eslint-plugin-tailwindcss';

export default antfu(
  {
    react: true,
    typescript: true,
    jsonc: false,

    lessOpinionated: true,
    isInEditor: false,

    stylistic: {
      semi: true,
      indent: 2,
      quotes: 'single',
      arrowParens: 'avoid',
    },

    formatters: {
      css: true,
    },

    ignores: [
      'next-env.d.ts',
      '**/ui/**/*.tsx',
      '**/ui/**/*.ts',
      '**/components/extends/**/*.ts',
      '**/components/extends/**/*.tsx',
      '**/hooks/*.ts',
      'tailwind.config.ts',
    ],
  },
  ...tailwind.configs['flat/recommended'],
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'off',
      'simple-import-sort/exports': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e.ts'],
  },
  {
    rules: {
      'import/order': 'off', // Avoid conflicts with `simple-import-sort` plugin
      'sort-imports': 'off', // Avoid conflicts with `simple-import-sort` plugin
      'ts/consistent-type-definitions': ['off', 'type'], // Use `type` instead of `interface`
      'ts/consistent-type-imports': 'off', // Avoid conflicts with `simple-import-sort` plugin
      'react/prefer-destructuring-assignment': 'off',
      'node/prefer-global/process': 'off', // Allow using `process.env`,
      'no-console': 'warn',
      'ts/no-empty-object-type': 'off',
      'no-empty-pattern': 'off',
      'react/no-array-index-key': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'react/no-unstable-default-props': 'off',
      'style/max-statements-per-line': 'off',
      'style/multiline-ternary': 'off',
      'tailwindcss/migration-from-tailwind-2': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': 'off',
      'style/indent': 'off',
      'style/indent-binary-ops': 'off',
      'style/brace-style': 'off',
      'style/jsx-one-expression-per-line': 'off',
      'style/arrow-parens': 'off',
      'style/operator-linebreak': 'off',
      'style/jsx-curly-newline': 'off',
      'prefer-promise-reject-errors': 'off',
      'no-extra-boolean-cast': 'off',
      'react/no-useless-fragment': 'off',
      curly: 'off',
      'style/quote-props': 'off',
      'style/jsx-wrap-multilines': 'off',
      'unicorn/number-literal-case': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
      'no-restricted-globals': 'off',
      'vars-on-top': 'off',
      'no-var': 'off',
      'react/no-unstable-context-value': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'tailwindcss/classnames-order': 'off',
      'ts/no-use-before-define': 'off',
      'unicorn/no-instanceof-array': 'off',
    },
  },
);
