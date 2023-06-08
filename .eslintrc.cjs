module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  ignorePatterns: ['*.d.ts', 'node_modules', 'dist', 'GAHead.astro'],
  extends: [
    'eslint:recommended',
    'plugin:import/typescript',
    'plugin:astro/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  globals: {
    astroHTML: true,
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      2,
      {
        prefer: 'type-imports',
      },
    ],
    'import/order': 'off',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-unused-vars': 'off',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {},
    },
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
    },
  ],
};
