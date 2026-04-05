import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/---/', // GitHub 仓库名
  build: {
    outDir: 'docs', // 将打包输出目录改为 docs，方便 GitHub Pages 部署
    rollupOptions: {
      output: {
        // 强制重命名带有下划线开头的 chunk，彻底解决 GitHub Pages (Jekyll) 忽略下划线文件导致的 404 黑屏问题
        chunkFileNames: (chunkInfo) => {
          let name = chunkInfo.name;
          if (name.startsWith('_')) {
            name = name.substring(1);
          }
          return `assets/${name}-[hash].js`;
        },
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    }
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