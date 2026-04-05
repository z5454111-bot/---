<template>
  <div class="home-container">
    <!-- 左侧边栏：当前宝可梦等信息占位 -->
    <aside class="sidebar left-sidebar">
      <div class="sidebar-header">
        <h3>同行宝可梦</h3>
      </div>
      <div class="sidebar-content">
        <p class="placeholder-text">暂无宝可梦</p>
        <!-- 未来开发：宝可梦列表 -->
      </div>
    </aside>

    <!-- 中间主区域：AI 聊天 -->
    <main class="chat-main">
      <div class="chat-header">
        <h2>宝可梦世界旅途</h2>
      </div>
      
      <div class="chat-messages" ref="chatMessagesRef">
        <!-- 初始角色信息展示 -->
        <div class="message system-message">
          <div class="message-content yaml-content">
            <pre><code>{{ initialYamlInfo }}</code></pre>
          </div>
        </div>

        <!-- 聊天记录 -->
        <div 
          v-for="(msg, index) in chatHistory" 
          :key="index" 
          class="message"
          :class="msg.role === 'user' ? 'user-message' : 'ai-message'"
        >
          <div class="message-avatar">
            {{ msg.role === 'user' ? '我' : 'AI' }}
          </div>
          <div class="message-content">
            {{ msg.content }}
          </div>
        </div>

        <!-- 正在生成的回复 -->
        <div v-if="isGenerating" class="message ai-message">
          <div class="message-avatar">AI</div>
          <div class="message-content streaming-content">
            {{ currentStreamText }}<span class="cursor"></span>
          </div>
        </div>
      </div>

      <!-- 底部输入区 -->
      <div class="chat-input-area">
        <textarea 
          v-model="userInput" 
          class="chat-input" 
          placeholder="输入你的行动或对话..."
          @keydown.enter.prevent="sendMessage"
          :disabled="isGenerating"
        ></textarea>
        <button 
          class="send-btn" 
          @click="sendMessage" 
          :disabled="!userInput.trim() || isGenerating"
        >
          发送
        </button>
      </div>
    </main>

    <!-- 右侧边栏：电脑、周围NPC等信息占位 -->
    <aside class="sidebar right-sidebar">
      <div class="sidebar-header">
        <h3>周围环境</h3>
      </div>
      <div class="sidebar-content">
        <p class="placeholder-text">当前位置：{{ playerStore.background }}</p>
        <!-- 未来开发：NPC列表、电脑等 -->
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePlayerStore } from '@/store/player'
import { setChatVariables, generateResponse, isTavernEnv } from '@/utils/tavern'

const playerStore = usePlayerStore()
const chatMessagesRef = ref<HTMLElement | null>(null)

// 聊天状态
interface ChatMessage {
  role: 'user' | 'ai' | 'system'
  content: string
}
const chatHistory = ref<ChatMessage[]>([])
const userInput = ref('')
const isGenerating = ref(false)
const currentStreamText = ref('')

// 生成初始角色信息的 YAML 格式
const initialYamlInfo = computed(() => {
  return `---
角色信息:
  姓名: ${playerStore.name}
  性别: ${playerStore.gender === 'boy' ? '男' : playerStore.gender === 'girl' ? '女' : '其他'}
  年龄: ${playerStore.age}
  出身地: ${playerStore.background}
  难度: ${playerStore.difficulty}
  金钱: ${playerStore.money}
属性:
  HP: ${playerStore.stats.hp}
  攻击: ${playerStore.stats.atk}
  防御: ${playerStore.stats.def}
  特攻: ${playerStore.stats.spa}
  特防: ${playerStore.stats.spd}
  速度: ${playerStore.stats.spe}
天赋:
  - ${playerStore.talents.join('\n  - ')}
---`
})

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

// 发送消息
const sendMessage = async () => {
  const text = userInput.value.trim()
  if (!text || isGenerating.value) return

  // 添加用户消息
  chatHistory.value.push({ role: 'user', content: text })
  userInput.value = ''
  scrollToBottom()

  // 开始生成 AI 回复
  isGenerating.value = true
  currentStreamText.value = ''

  try {
    // 调用酒馆助手 API
    const finalResponse = await generateResponse(text, (streamText) => {
      currentStreamText.value = streamText
      scrollToBottom()
    })

    // 生成完成，添加到历史记录
    chatHistory.value.push({ role: 'ai', content: finalResponse })
  } catch (error) {
    console.error('生成回复失败:', error)
    chatHistory.value.push({ role: 'system', content: '系统提示：生成回复失败，请检查连接。' })
  } finally {
    isGenerating.value = false
    currentStreamText.value = ''
    scrollToBottom()
  }
}

// 初始化：同步变量到酒馆
onMounted(async () => {
  if (isTavernEnv()) {
    // 将玩家信息同步为酒馆变量
    const variables = {
      player: {
        name: playerStore.name,
        gender: playerStore.gender,
        age: playerStore.age,
        background: playerStore.background,
        money: playerStore.money,
        stats: playerStore.stats,
        talents: playerStore.talents
      }
    }
    await setChatVariables(variables)
  }
})
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
  overflow: hidden;
}

/* 侧边栏通用样式 */
.sidebar {
  width: 250px;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
  z-index: 10;
}

.right-sidebar {
  border-right: none;
  border-left: 1px solid #e0e0e0;
  box-shadow: -2px 0 5px rgba(0,0,0,0.05);
}

.sidebar-header {
  padding: 15px;
  background-color: #3b4cca;
  color: white;
  text-align: center;
  border-bottom: 2px solid #2a3698;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.sidebar-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.placeholder-text {
  color: #999;
  text-align: center;
  font-style: italic;
  margin-top: 20px;
}

/* 主聊天区域 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  position: relative;
}

.chat-header {
  padding: 15px 20px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  text-align: center;
}

.chat-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 消息气泡样式 */
.message {
  display: flex;
  gap: 10px;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-message {
  align-self: flex-start;
}

.system-message {
  align-self: center;
  max-width: 90%;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background-color: #4caf50;
}

.ai-message .message-avatar {
  background-color: #3b4cca;
}

.message-content {
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
}

.user-message .message-content {
  background-color: #e3f2fd;
  border-top-right-radius: 0;
}

.ai-message .message-content {
  background-color: #fff;
  border-top-left-radius: 0;
}

.yaml-content {
  background-color: #2d2d2d;
  color: #a9b7c6;
  font-family: monospace;
  padding: 15px;
  border-radius: 8px;
  width: 100%;
  overflow-x: auto;
}

.yaml-content pre {
  margin: 0;
}

/* 流式输出光标 */
.cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background-color: #333;
  vertical-align: middle;
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 输入区样式 */
.chat-input-area {
  padding: 15px 20px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 20px;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: #3b4cca;
}

.chat-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.send-btn {
  padding: 10px 25px;
  background-color: #3b4cca;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  height: 44px;
}

.send-btn:hover:not(:disabled) {
  background-color: #2a3698;
}

.send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.send-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>