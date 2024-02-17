module.exports = {
    root: true,
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        'plugin:prettier/recommended', // 让 ESLint 使用 Prettier 的规则
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: false, // 根据你的项目需要设置
        },
    },
    plugins: ['vue', 'prettier'],
    rules: {
        // 在这里添加或覆盖你的自定义规则
        'prettier/prettier': 'error', // 让 ESLint 检查 Prettier 的规则，并作为错误处理
    },
    ignorePatterns: [
        'node_modules/*',
        '**/*.spec.js',
        '**/*.spec.vue',
        '**/*.snapshot',
        '**/*.d.ts', // 如果你有 TypeScript 定义文件，也可以忽略
    ],
};
