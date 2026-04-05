<template>
  <div class="talents-screen">
    <!-- 标题区域 -->
    <div class="title-container">
      <h1 class="game-title">初始天赋</h1>
      <p class="subtitle">STARTING TALENTS</p>
    </div>

    <div class="content-container">
      <div class="points-header">
        <div class="points-display">
          剩余点数: <span class="points-value">{{ remainingPoints }}</span>
        </div>
        <div class="hint">选择你的初始天赋，这将极大影响你的旅途。</div>
      </div>

      <div class="talents-grid">
        <div 
          v-for="(talent, index) in availableTalents" 
          :key="index"
          class="talent-card"
          :class="{ 
            active: selectedTalents.includes(talent.id),
            disabled: !selectedTalents.includes(talent.id) && remainingPoints < talent.cost
          }"
          @click="toggleTalent(talent)"
        >
          <div class="talent-header">
            <span class="talent-name">{{ talent.name }}</span>
            <span class="talent-cost" :class="{ free: talent.cost === 0 }">
              {{ talent.cost === 0 ? '免费' : `-${talent.cost} 点` }}
            </span>
          </div>
          <p class="talent-desc">{{ talent.desc }}</p>
        </div>
      </div>
    </div>

    <!-- 底部操作区 -->
    <div class="footer">
      <button class="action-btn back-btn" @click="router.back()">返回</button>
      <button class="action-btn" @click="handleComplete">完成创建</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { usePlayerStore } from '@/store/player'

const router = useRouter()
const message = useMessage()
const playerStore = usePlayerStore()

// 天赋配置
const availableTalents = [
  { id: 't1', name: '宝可梦亲和', cost: 500, desc: '野生宝可梦更容易亲近你，捕获率小幅提升。' },
  { id: 't2', name: '过目不忘', cost: 800, desc: '看过的宝可梦信息会自动记录到图鉴中。' },
  { id: 't3', name: '天生神力', cost: 1000, desc: '可以徒手与部分弱小宝可梦搏斗。' },
  { id: 't4', name: '富二代', cost: 1500, desc: '初始资金增加 10000，商店购买享受 9 折优惠。' },
  { id: 't5', name: '幸运儿', cost: 2000, desc: '更容易遇到异色(闪光)宝可梦，道具掉落率提升。' },
  { id: 't6', name: '培育天才', cost: 1200, desc: '孵蛋所需步数减半，宝可梦升级所需经验减少 10%。' },
  { id: 't7', name: '方向感极佳', cost: 300, desc: '在野外探索时不容易迷路，减少遇险概率。' },
  { id: 't8', name: '语言大师', cost: 2500, desc: '能够听懂部分宝可梦的语言。' }
]

// 本地状态
const selectedTalents = ref<string[]>([...playerStore.talents])
const basePoints = ref(playerStore.initialPoints) // 进入页面时的点数

// 计算已选天赋消耗
const talentsCost = computed(() => {
  return selectedTalents.value.reduce((total, id) => {
    const talent = availableTalents.find(t => t.id === id)
    return total + (talent ? talent.cost : 0)
  }, 0)
})

// 计算剩余点数
const remainingPoints = computed(() => {
  return basePoints.value - talentsCost.value
})

// 切换天赋选择
const toggleTalent = (talent: typeof availableTalents[0]) => {
  const index = selectedTalents.value.indexOf(talent.id)
  
  if (index > -1) {
    // 取消选择
    selectedTalents.value.splice(index, 1)
  } else {
    // 尝试选择
    if (remainingPoints.value >= talent.cost) {
      selectedTalents.value.push(talent.id)
    } else {
      message.warning('点数不足，无法选择该天赋！')
    }
  }
}

// 完成创建
const handleComplete = () => {
  if (remainingPoints.value < 0) {
    message.error('点数透支，请重新选择！')
    return
  }

  // 保存天赋到 store
  playerStore.setTalents(selectedTalents.value, remainingPoints.value)
  
  // 应用天赋的即时效果 (例如富二代加钱)
  if (selectedTalents.value.includes('t4')) {
    playerStore.money += 10000
  }
  
  message.success('角色创建完成！即将开始旅途...')
  
  // 跳转到游戏主页
  router.push('/home')
}
</script>

<style scoped>
.talents-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f8f8f8;
  color: #333;
  padding: 20px 0;
  box-sizing: border-box;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
}

.title-container {
  text-align: center;
  margin-bottom: 20px;
}

.game-title {
  font-size: 2rem;
  margin: 0;
  color: #ffcb05;
  text-shadow: 
    -2px -2px 0 #3b4cca,
    2px -2px 0 #3b4cca,
    -2px 2px 0 #3b4cca,
    2px 2px 0 #3b4cca,
    3px 3px 0 #2a3698;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 0.8rem;
  margin-top: 5px;
  color: #3b4cca;
  font-weight: bold;
}

.content-container {
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 1000px;
  flex-grow: 1;
  margin-bottom: 20px;
  background-color: #fff;
  border: 4px solid #555;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
}

.points-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eee;
}

.points-display {
  font-size: 1.5rem;
  font-weight: bold;
  background-color: #3b4cca;
  color: white;
  padding: 8px 20px;
  border-radius: 25px;
}

.points-value {
  color: #ffcb05;
}

.hint {
  color: #666;
  font-size: 1.1rem;
}

.talents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  overflow-y: auto;
  padding-right: 10px;
}

.talent-card {
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.talent-card:hover:not(.disabled) {
  border-color: #999;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.talent-card.active {
  border-color: #e3350d;
  background-color: #ffebee;
}

.talent-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(100%);
}

.talent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.talent-name {
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
}

.talent-card.active .talent-name {
  color: #e3350d;
}

.talent-cost {
  font-size: 1rem;
  color: #e3350d;
  font-weight: bold;
  background-color: rgba(255,255,255,0.8);
  padding: 2px 8px;
  border-radius: 4px;
}

.talent-cost.free {
  color: #4caf50;
}

.talent-desc {
  margin: 0;
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
}

/* 底部按钮 */
.footer {
  display: flex;
  gap: 20px;
}

.action-btn {
  font-size: 1.2rem;
  padding: 10px 30px;
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
</style>