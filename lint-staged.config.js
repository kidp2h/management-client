module.exports = {
  '*': ['npm run format', 'eslint --fix --no-warn-ignored'],
  '**/*.ts?(x)': () => 'npm run check-types',
};
