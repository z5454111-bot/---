<template>
  <!-- NaiveUI 的全局配置组件，如主题、语言等可在此配置 -->
  <n-config-provider>
    <n-message-provider>
      <n-dialog-provider>
        <!-- 路由出口 -->
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui'
// App 根组件，主要用于包裹全局 Provider 和路由视图
</script>

<style>
/* 引入像素字体 */
@font-face {
  font-family: 'PokemonPixel';
  src: url('@/assets/fonts/xiangsuzi.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

/* 基础样式重置 */
body {
  margin: 0;
  padding: 0;
  /* 全局使用像素字体 */
  font-family: 'PokemonPixel', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  /* 禁用文本选择，增强游戏感 */
  user-select: none;
  /* 黑色背景，符合GBA风格 */
  background-color: #000;
  color: #fff;
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>