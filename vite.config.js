import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
 resolve: {
    alias: {
      // This helps resolve the old package name
      '@videosdk.live/rtc-js-prebuilt': '@videosdk.live/react-sdk'
    }
  }
})
