<template>
  <div class="traits-screen">
    <!-- 标题区域 -->
    <div class="title-container">
      <h1 class="game-title">初始城镇与种族值</h1>
      <p class="subtitle">HOMETOWN & BASE STATS</p>
    </div>

    <div class="content-container">
      <!-- 左侧：初始城镇选择 -->
      <div class="panel background-panel">
        <h2 class="panel-title">选择初始城镇</h2>
        <div class="background-list">
          <div 
            v-for="(bg, index) in backgrounds" 
            :key="index"
            class="bg-item"
            :class="{ active: selectedBg === bg.name }"
            @click="selectBackground(bg)"
          >
            <div class="bg-header">
              <span class="bg-name">{{ bg.name }}</span>
              <span class="bg-cost" :class="{ free: bg.cost === 0 }">
                {{ bg.cost === 0 ? '免费' : `-${bg.cost} 点` }}
              </span>
            </div>
            <p class="bg-desc">{{ bg.desc }}</p>
          </div>
        </div>
      </div>

      <!-- 右侧：能力加点 -->
      <div class="panel stats-panel">
        <div class="points-header">
          <h2 class="panel-title">能力分配</h2>
          <div class="points-display">
            剩余点数: <span class="points-value">{{ remainingPoints }}</span>
          </div>
        </div>

        <div class="stats-list">
          <div v-for="(stat, key) in statsConfig" :key="key" class="stat-item">
            <div class="stat-label">
              <span class="stat-name">{{ stat.name }}</span>
              <span class="stat-desc">{{ stat.desc }}</span>
            </div>
            <div class="stat-controls">
              <button
                class="stat-btn"
                @click="decreaseStat(key as keyof typeof currentStats)"
                :disabled="currentStats[key as keyof typeof currentStats] <= 5"
              >-</button>
              <div class="stat-bar-container">
                <!-- 进度条最大值按 255 计算 -->
                <div class="stat-bar" :style="{ width: `${(currentStats[key as keyof typeof currentStats] / 255) * 100}%` }"></div>
                <span class="stat-value">{{ currentStats[key as keyof typeof currentStats] }}</span>
              </div>
              <button
                class="stat-btn"
                @click="increaseStat(key as keyof typeof currentStats)"
                :disabled="remainingPoints < statCost || currentStats[key as keyof typeof currentStats] >= 255"
              >+</button>
            </div>
          </div>
        </div>
        <div class="stat-hint">提示：每提升1点能力消耗 {{ statCost }} 点数。</div>
      </div>
    </div>

    <!-- 底部操作区 -->
    <div class="footer">
      <button class="action-btn back-btn" @click="router.back()">返回</button>
      <button class="action-btn" @click="handleNext">下一步</button>
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

// 出身配置
const backgrounds = [
  { name: '普通镇民', cost: 0, desc: '平平无奇的普通人，没有任何特殊加成。' },
  { name: '超能力者', cost: 1000, desc: '天生具备超能力，初始特攻+20，特防+10。' },
  { name: '格斗家', cost: 800, desc: '常年锻炼肉体，初始攻击+15，防御+10。' },
  { name: '长跑健将', cost: 500, desc: '耐力惊人，初始HP+10，速度+15。' },
  { name: '富家子弟', cost: 1000, desc: '家里有矿，初始金钱+5000，但全属性-5。' }
]

// 种族值配置 (人类也是宝可梦！)
const statsConfig = {
  hp: { name: 'HP', desc: '影响生命值上限' },
  atk: { name: '攻击', desc: '影响物理伤害' },
  def: { name: '防御', desc: '影响物理抗性' },
  spa: { name: '特攻', desc: '影响特殊伤害/超能力' },
  spd: { name: '特防', desc: '影响特殊抗性/精神力' },
  spe: { name: '速度', desc: '影响出手顺序/敏捷' }
}

// 提升1点种族值消耗的点数
const statCost = 10

// 本地状态
const selectedBg = ref(backgrounds[0].name)
const currentStats = ref({ ...playerStore.stats })
const basePoints = ref(playerStore.initialPoints) // 记录进入页面时的初始点数

// 计算当前出身消耗
const currentBgCost = computed(() => {
  const bg = backgrounds.find(b => b.name === selectedBg.value)
  return bg ? bg.cost : 0
})

// 计算种族值加点消耗
const statsCost = computed(() => {
  let cost = 0
  for (const key in currentStats.value) {
    const k = key as keyof typeof currentStats.value
    // 基础值是5，计算增加的部分
    const added = currentStats.value[k] - 5
    if (added > 0) {
      cost += added * statCost
    }
  }
  return cost
})

// 计算剩余点数
const remainingPoints = computed(() => {
  return basePoints.value - currentBgCost.value - statsCost.value
})

// 选择出身
const selectBackground = (bg: typeof backgrounds[0]) => {
  // 检查点数是否足够切换出身
  const newRemaining = basePoints.value - bg.cost - statsCost.value
  if (newRemaining < 0) {
    message.warning('点数不足，无法选择该出身！请先减少能力加点。')
    return
  }
  selectedBg.value = bg.name
}

// 增加种族值
const increaseStat = (key: keyof typeof currentStats.value, amount: number = 1) => {
  // 种族值单项上限暂定为 255 (参考幸福蛋HP)
  const maxAdd = Math.min(amount, 255 - currentStats.value[key])
  const affordableAdd = Math.floor(remainingPoints.value / statCost)
  const actualAdd = Math.min(maxAdd, affordableAdd)
  
  if (actualAdd > 0) {
    currentStats.value[key] += actualAdd
  }
}

// 减少种族值
const decreaseStat = (key: keyof typeof currentStats.value, amount: number = 1) => {
  // 种族值下限暂定为 5 (参考壶壶攻击)
  const maxSub = Math.min(amount, currentStats.value[key] - 5)
  
  if (maxSub > 0) {
    currentStats.value[key] -= maxSub
  }
}

// 下一步
const handleNext = () => {
  if (remainingPoints.value < 0) {
    message.error('点数透支，请重新分配！')
    return
  }

  // 保存出身和能力到 store
  playerStore.setTraits(selectedBg.value, currentStats.value, remainingPoints.value)
  
  // 跳转到天赋选择页面
  router.push('/character/talents')
}
</script>

<style scoped>
.traits-screen {
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
  gap: 20px;
  width: 90%;
  max-width: 1000px;
  flex-grow: 1;
  margin-bottom: 20px;
}

.panel {
  background-color: #fff;
  border: 4px solid #555;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.background-panel {
  flex: 1;
}

.stats-panel {
  flex: 1.2;
}

.panel-title {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: #3b4cca;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

/* 出身列表样式 */
.background-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  flex-grow: 1;
}

.bg-item {
  border: 2px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f9f9f9;
}

.bg-item:hover {
  border-color: #999;
}

.bg-item.active {
  border-color: #e3350d;
  background-color: #ffebee;
}

.bg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.bg-name {
  font-weight: bold;
  font-size: 1.1rem;
}

.bg-cost {
  font-size: 0.9rem;
  color: #e3350d;
  font-weight: bold;
}

.bg-cost.free {
  color: #4caf50;
}

.bg-desc {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

/* 能力面板样式 */
.points-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.points-display {
  font-size: 1.2rem;
  font-weight: bold;
  background-color: #3b4cca;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
}

.points-value {
  color: #ffcb05;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-label {
  width: 100px;
}

.stat-name {
  display: block;
  font-weight: bold;
  font-size: 1.1rem;
}

.stat-desc {
  display: block;
  font-size: 0.7rem;
  color: #888;
}

.stat-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-grow: 1;
}

.stat-btn {
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  border: none;
  background-color: #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stat-btn:not(:disabled):active {
  background-color: #ccc;
}

.stat-bar-container {
  flex-grow: 1;
  height: 24px;
  background-color: #eee;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid #ccc;
}

.stat-bar {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.2s;
}

.stat-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
  text-shadow: 1px 1px 0 rgba(255,255,255,0.8);
}

.stat-hint {
  margin-top: 15px;
  font-size: 0.8rem;
  color: #888;
  text-align: right;
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