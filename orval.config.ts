import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: './swagger.json',
    output: {
      mode: 'tags-split',
      target: 'src/hooks/api/endpoints.ts',
      schemas: 'src/types/api',
      client: 'react-query',
      prettier: true,
      override: {
        mutator: {
          path: './src/lib/api.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
