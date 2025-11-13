import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:8080/api-docs', // sign up at app.heyapi.dev
  output: 'src/client',
  plugins: [
    '@hey-api/client-axios',
    'zod',
    {
      name: '@hey-api/sdk', 
      validator: true, 
    },
  ]
});