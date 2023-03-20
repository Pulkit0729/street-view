import { defineConfig } from 'vite'


export default {
  build: {
    sourcemap: true,
  },
  define: {
    'process.env': {}
  }
}
