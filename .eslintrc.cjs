module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: {
      ts: '@typescript-eslint/parser',
      js: '@typescript-eslint/parser',
      '<template>': 'espree'
    }
  },
  plugins: [
    '@typescript-eslint',
    'vue'
  ],
  rules: {
    // Vue 관련 규칙
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off', // 선택적 prop에 대한 기본값 요구 비활성화
    
    // TypeScript 관련 규칙
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    
    // 일반 규칙
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.config.js',
    '*.config.ts',
    'openapi-ts.config.ts',
    'src/client/**/*.gen.ts'
  ]
}

