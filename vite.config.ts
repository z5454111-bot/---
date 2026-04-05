import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/---/', // GitHub 仓库名
  build: {
    outDir: 'docs', // 将打包输出目录改为 docs，方便 GitHub Pages 部署
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 配置 @ 指向 src 目录
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})