<template>
  <div class="start-screen">
    <!-- 标题区域 -->
    <div class="title-container">
      <h1 class="game-title">宝可梦世界</h1>
      <p class="subtitle">POKÉMON WORLD</p>
    </div>

    <!-- 菜单区域 -->
    <div class="menu-container">
      <div class="menu-box">
        <div 
          v-for="(item, index) in menuItems" 
          :key="index"
          class="menu-item"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = -1"
          @click="handleMenuClick(item.action)"
        >
          <!-- 鼠标悬浮时显示的小箭头指示器 -->
          <span class="indicator" :class="{ active: hoverIndex === index }">▶</span>
          <span class="text">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- 底部版权信息 -->
    <div class="footer">
      <p>©2024 Kilo Code</p>
      <p>Press Start to Play</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'

const router = useRouter()
const message = useMessage()

// 当前鼠标悬浮的菜单项索引
const hoverIndex = ref(-1)

// 菜单配置
const menuItems = [
  { label: '开始新游戏', action: 'newGame' },
  { label: '继续游戏', action: 'continue' },
  { label: '选项', action: 'options' }
]

// 处理菜单点击
const handleMenuClick = (action: string) => {
  switch (action) {
    case 'newGame':
      // 跳转到难度选择页面
      router.push('/difficulty')
      break
    case 'continue':
      // TODO: 检查存档并加载
      message.info('读取存档中...')
      break
    case 'options':
      // TODO: 打开设置面板
      message.info('打开设置')
      break
  }
}
</script>

<style scoped>
.start-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  width: 100vw;
  background-color: #f8f8f8; /* GBA 经典浅色背景 */
  color: #333;
  padding: 40px 0;
  box-sizing: border-box;
  /* 模拟 GBA 屏幕的内阴影 */
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
}

.title-container {
  text-align: center;
  margin-top: 10vh;
  animation: float 3s ease-in-out infinite;
}

.game-title {
  font-size: 4rem;
  margin: 0;
  color: #ffcb05; /* 宝可梦经典黄 */
  text-shadow: 
    -3px -3px 0 #3b4cca, /* 宝可梦经典蓝描边 */
    3px -3px 0 #3b4cca,
    -3px 3px 0 #3b4cca,
    3px 3px 0 #3b4cca,
    4px 4px 0 #2a3698; /* 阴影 */
  letter-spacing: 4px;
}

.subtitle {
  font-size: 1.5rem;
  margin-top: 10px;
  color: #3b4cca;
  font-weight: bold;
  letter-spacing: 2px;
}

.menu-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-box {
  background-color: #fff;
  border: 4px solid #555;
  border-radius: 8px;
  padding: 20px 30px;
  min-width: 200px;
  /* 经典 GBA 菜单阴影 */
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
}

.menu-item {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  margin: 15px 0;
  cursor: pointer;
  transition: transform 0.1s;
  line-height: 1;
  height: 32px; /* 固定高度，防止 NaiveUI 动态注入样式导致行高变化 */
}

.menu-item:active {
  transform: scale(0.95);
}

.indicator {
  color: transparent; /* 默认透明 */
  margin-right: 10px;
  font-size: 1.2rem;
}

.indicator.active {
  color: #e3350d; /* 宝可梦经典红 */
  animation: blink 1s step-end infinite;
}

.text {
  color: #333;
}

.footer {
  text-align: center;
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
}

.footer p {
  margin: 5px 0;
}

/* 动画定义 */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>