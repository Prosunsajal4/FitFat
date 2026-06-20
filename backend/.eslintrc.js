module.exports = {
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', { singleQuote: true, trailingComma: 'es5', printWidth: 100 }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'multi-line'],
  },
  env: { node: true, es2021: true, jest: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
};
