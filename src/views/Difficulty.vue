<template>
  <div class="difficulty-screen">
    <!-- 标题区域 -->
    <div class="title-container">
      <h1 class="game-title">选择难度</h1>
      <p class="subtitle">CHOOSE DIFFICULTY</p>
    </div>

    <!-- 难度选择区域 -->
    <div class="menu-container">
      <div class="menu-box">
        <div 
          v-for="(item, index) in difficultyOptions" 
          :key="index"
          class="menu-item"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = -1"
          @click="handleDifficultySelect(item)"
        >
          <!-- 鼠标悬浮时显示的小箭头指示器 -->
          <span class="indicator" :class="{ active: hoverIndex === index }">▶</span>
          <div class="text-content">
            <span class="text">{{ item.label }}</span>
            <span class="points-info" v-if="hoverIndex === index">
              初始点数: {{ item.points }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提示信息 -->
    <div class="footer">
      <p>请谨慎选择，难度将决定你的旅途体验</p>
      <button class="action-btn back-btn" @click="router.back()">返回</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { usePlayerStore, DifficultyLevel } from '@/store/player'

const router = useRouter()
const message = useMessage()
const playerStore = usePlayerStore()

// 当前鼠标悬浮的菜单项索引
const hoverIndex = ref(-1)

// 难度选项配置
// 和平: 9999, 极限: 0
// 简单、普通、困难在 0-9999 之间分配，去掉最高最低
const difficultyOptions: Array<{ label: string, level: DifficultyLevel, points: number }> = [
  { label: '和平', level: 'peaceful', points: 9999 },
  { label: '简单', level: 'easy', points: 6000 },
  { label: '普通', level: 'normal', points: 3000 },
  { label: '困难', level: 'hard', points: 1000 },
  { label: '极限', level: 'extreme', points: 0 }
]

// 处理难度选择
const handleDifficultySelect = (option: { label: string, level: DifficultyLevel, points: number }) => {
  // 保存难度和初始点数到 store
  playerStore.setDifficulty(option.level, option.points)
  
  message.success(`已选择 ${option.label} 难度，获得 ${option.points} 初始点数！`)
  
  // 跳转到基本信息填写页面
  router.push('/character/basic-info')
}
</script>

<style scoped>
.difficulty-screen {
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
  font-size: 3rem;
  margin: 0;
  color: #ffcb05; /* 宝可梦经典黄 */
  text-shadow: 
    -2px -2px 0 #3b4cca, /* 宝可梦经典蓝描边 */
    2px -2px 0 #3b4cca,
    -2px 2px 0 #3b4cca,
    2px 2px 0 #3b4cca,
    3px 3px 0 #2a3698; /* 阴影 */
  letter-spacing: 4px;
}

.subtitle {
  font-size: 1.2rem;
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
  min-width: 300px;
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
  height: 40px; /* 固定高度 */
}

.menu-item:active {
  transform: scale(0.95);
}

.indicator {
  color: transparent; /* 默认透明 */
  margin-right: 10px;
  font-size: 1.2rem;
  width: 20px;
}

.indicator.active {
  color: #e3350d; /* 宝可梦经典红 */
  animation: blink 1s step-end infinite;
}

.text-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.text {
  color: #333;
  font-weight: bold;
}

.points-info {
  font-size: 1rem;
  color: #666;
  background-color: #eee;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.footer {
  text-align: center;
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
}

.footer p {
  margin: 5px 0 15px 0;
}

.action-btn {
  font-size: 1.2rem;
  padding: 8px 30px;
  background-color: #3b4cca;
  color: white;
  border: 4px solid #2a3698;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.1s;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
}

.action-btn.back-btn {
  background-color: #9e9e9e;
  border-color: #616161;
}

.action-btn:active {
  transform: scale(0.95);
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