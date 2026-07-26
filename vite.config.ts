import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-chartjs-2') || id.includes('chart.js')) return 'charts'
          if (id.includes('@mui/icons-material') || id.includes('lucide-react')) return 'icons'
          if (id.includes('@mui') || id.includes('@emotion')) return 'mui'
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) return 'react'
          return undefined
        },
      },
    },
  },
})
