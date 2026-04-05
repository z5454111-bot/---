<template>
  <div class="story-screen">
    <div class="story-container">
      <div class="story-content" v-html="formattedStory"></div>
      
      <div class="loading-indicator" v-if="isGenerating">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>

    <div class="footer" v-if="!isGenerating">
      <button class="action-btn" @click="startGame">开始旅途</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/store/player'
import { getTavernHelper } from '@/utils/tavern'

const router = useRouter()
const playerStore = usePlayerStore()

const storyText = ref('')
const isGenerating = ref(true)

// 格式化故事文本，将换行符转换为 <br>
const formattedStory = computed(() => {
  return storyText.value.replace(/\n/g, '<br>')
})

onMounted(async () => {
  const th = getTavernHelper()
  
  // 构建 YAML 格式的提示词，使用宏语法获取变量
  const yamlPrompt = `请根据以下玩家设定，生成一段宝可梦世界的开局剧情。
要求：
1. 剧情要符合宝可梦世界的设定。
2. 描述玩家在出身地准备出发的情景。
3. 结尾要引出玩家即将获得第一只宝可梦或者踏上旅途。
4. 不要输出任何多余的解释，直接开始剧情描写。

\`\`\`yaml
玩家设定:
  姓名: "{{getvar::player_name}}"
  性别: "{{getvar::player_gender}}"
  年龄: "{{getvar::player_age}}"
  出身地: "{{getvar::player_background}}"
  难度: "{{getvar::player_difficulty}}"
  天赋: "{{getvar::player_talents}}"
\`\`\`
`

  if (th) {
    try {
      // 监听流式输出
      const listener = th.eventOn(th.iframe_events.STREAM_TOKEN_RECEIVED_FULLY, (text: string) => {
        storyText.value = text
      })

      // 发送生成请求
      // should_silence: true 表示静默生成，不会影响酒馆的停止按钮状态
      // 并且 generate 本身只会返回生成的文本，不会自动将内容写入到聊天历史（即不会跑到"1层"）
      const result = await th.generate({
        user_input: yamlPrompt,
        should_silence: true,
        should_stream: true,
        injects: [
          {
            role: 'system',
            content: '现在开始宝可梦角色扮演游戏。请根据玩家的设定，生成一段开局剧情。不要输出任何多余的解释，直接开始剧情描写。',
            position: 'in_chat',
            depth: 0,
            should_scan: true
          }
        ]
      })

      // 生成结束
      listener.stop()
      storyText.value = result
    } catch (error) {
      console.error('生成剧情失败:', error)
      storyText.value = '生成剧情失败，请检查网络或 API 设置。'
    } finally {
      isGenerating.value = false
    }
  } else {
    // 本地测试模拟生成
    let text = `清晨的阳光透过窗户洒在你的脸上，你揉了揉惺忪的睡眼，从床上坐了起来。
今天是你在${playerStore.background}出发的日子。
作为一名${playerStore.age}岁的${playerStore.gender === 'boy' ? '少年' : playerStore.gender === 'girl' ? '少女' : '训练家'}，你一直梦想着成为宝可梦大师。
你穿好衣服，背上行囊，走下楼梯。妈妈已经在厨房里为你准备好了丰盛的早餐。
“${playerStore.name}，快来吃早餐吧，吃饱了才有力气踏上旅途哦。”妈妈微笑着对你说。
你狼吞虎咽地吃完早餐，向妈妈道别后，推开了家门。
深吸一口气，你感受着清新的空气，心中充满了期待。
你的宝可梦之旅，即将开始！`
    
    let current = ''
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        current += text[i]
        storyText.value = current
        i++
      } else {
        clearInterval(timer)
        isGenerating.value = false
      }
    }, 50)
  }
})

const startGame = () => {
  router.push('/home')
}
</script>

<style scoped>
.story-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #1a1a1a;
  color: #eee;
  padding: 40px 20px;
  box-sizing: border-box;
}

.story-container {
  width: 90%;
  max-width: 800px;
  flex-grow: 1;
  background-color: rgba(0, 0, 0, 0.6);
  border: 2px solid #444;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  margin-bottom: 30px;
  position: relative;
}

.story-content {
  font-size: 1.2rem;
  line-height: 1.8;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  white-space: pre-wrap;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: #ffcb05;
  border-radius: 50%;
  margin: 0 5px;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.footer {
  display: flex;
  justify-content: center;
  width: 100%;
}

.action-btn {
  font-size: 1.5rem;
  padding: 15px 40px;
  background-color: #ffcb05;
  color: #3b4cca;
  border: 4px solid #c7a008;
  border-radius: 12px;
  cursor: pointer;
  font-family: inherit;
  font-weight: bold;
  transition: all 0.2s;
  box-shadow: 0 4px 0 #c7a008;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #c7a008;
}

.action-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #c7a008;
}
</style>