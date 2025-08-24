import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    force: true,
    include: [
      'react',
      'react-dom',
      'react-redux',
      '@reduxjs/toolkit',
      'react-router-dom'
    ]
  }
})