<template>
  <div class="basic-info-screen">
    <!-- 标题区域 -->
    <div class="title-container">
      <h1 class="game-title">基本信息</h1>
      <p class="subtitle">BASIC INFORMATION</p>
    </div>

    <!-- 信息填写区域 -->
    <div class="form-container">
      <div class="form-box">
        <!-- 姓名输入 -->
        <div class="form-item">
          <label>你的名字是？</label>
          <input 
            type="text" 
            v-model="playerName" 
            class="custom-input" 
            placeholder="请输入名字"
            maxlength="10"
          />
        </div>

        <!-- 性别选择 -->
        <div class="form-item">
          <label>你的性别是？</label>
          <div class="gender-options">
            <div 
              class="gender-btn" 
              :class="{ active: playerGender === 'boy' }"
              @click="playerGender = 'boy'"
            >
              👦 男孩
            </div>
            <div 
              class="gender-btn" 
              :class="{ active: playerGender === 'girl' }"
              @click="playerGender = 'girl'"
            >
              👧 女孩
            </div>
            <div 
              class="gender-btn" 
              :class="{ active: playerGender === 'other' }"
              @click="playerGender = 'other'"
            >
              ❓ 其他
            </div>
          </div>
        </div>

        <!-- 年龄选择 -->
        <div class="form-item">
          <label>你的年龄是？ (10-20岁)</label>
          <div class="age-selector">
            <button class="age-btn" @click="decreaseAge">-</button>
            <span class="age-display">{{ playerAge }} 岁</span>
            <button class="age-btn" @click="increaseAge">+</button>
          </div>
        </div>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { usePlayerStore, Gender } from '@/store/player'

const router = useRouter()
const message = useMessage()
const playerStore = usePlayerStore()

// 本地状态
const playerName = ref(playerStore.name)
const playerGender = ref<Gender>(playerStore.gender)
const playerAge = ref(playerStore.age)

// 年龄增减逻辑
const decreaseAge = () => {
  if (playerAge.value > 10) playerAge.value--
}
const increaseAge = () => {
  if (playerAge.value < 20) playerAge.value++
}

// 处理下一步
const handleNext = () => {
  if (!playerName.value.trim()) {
    message.warning('请输入你的名字！')
    return
  }

  // 保存基本信息到 store
  playerStore.setName(playerName.value.trim())
  playerStore.setBasicInfo(playerGender.value, playerAge.value)
  
  // 跳转到能力与出身选择页面
  router.push('/character/traits')
}
</script>

<style scoped>
.basic-info-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
  background-color: #f8f8f8;
  color: #333;
  padding: 40px 0;
  box-sizing: border-box;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
}

.title-container {
  text-align: center;
  margin-top: 5vh;
}

.game-title {
  font-size: 2.5rem;
  margin: 0;
  color: #ffcb05;
  text-shadow: 
    -2px -2px 0 #3b4cca,
    2px -2px 0 #3b4cca,
    -2px 2px 0 #3b4cca,
    2px 2px 0 #3b4cca,
    3px 3px 0 #2a3698;
  letter-spacing: 4px;
}

.subtitle {
  font-size: 1rem;
  margin-top: 10px;
  color: #3b4cca;
  font-weight: bold;
  letter-spacing: 2px;
}

.form-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.form-box {
  background-color: #fff;
  border: 4px solid #555;
  border-radius: 8px;
  padding: 30px;
  width: 80%;
  max-width: 500px;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-item label {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.custom-input {
  font-size: 1.2rem;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-family: inherit;
}

.custom-input:focus {
  border-color: #3b4cca;
}

.gender-options {
  display: flex;
  gap: 15px;
}

.gender-btn {
  flex: 1;
  text-align: center;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s;
  background-color: #f9f9f9;
}

.gender-btn.active {
  border-color: #e3350d;
  background-color: #ffebee;
  color: #e3350d;
  font-weight: bold;
}

.age-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background-color: #f9f9f9;
  border: 2px solid #ccc;
  border-radius: 4px;
  padding: 5px;
}

.age-btn {
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  border: none;
  background-color: #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.age-btn:active {
  background-color: #ccc;
}

.age-display {
  font-size: 1.5rem;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
}

.footer {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
}

.action-btn {
  font-size: 1.5rem;
  padding: 10px 40px;
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