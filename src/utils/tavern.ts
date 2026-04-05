/**
 * 封装酒馆助手 API
 * 依赖于 window.TavernHelper 和 window.SillyTavern
 */

// 检查是否在酒馆环境中
export const isTavernEnv = () => {
  return typeof window !== 'undefined' && !!(window as any).TavernHelper
}

// 获取 TavernHelper 实例
export const getTavernHelper = () => {
  if (!isTavernEnv()) {
    console.warn('不在酒馆环境中，无法使用 TavernHelper')
    return null
  }
  return (window as any).TavernHelper
}

// 获取 SillyTavern 实例
export const getSillyTavern = () => {
  if (typeof window === 'undefined' || !(window as any).SillyTavern) {
    console.warn('不在酒馆环境中，无法使用 SillyTavern')
    return null
  }
  return (window as any).SillyTavern
}

/**
 * 设置全局变量
 * @param variables 变量对象
 */
export const setGlobalVariables = async (variables: Record<string, any>) => {
  const th = getTavernHelper()
  if (!th) return

  try {
    // 使用 insertOrAssignVariables 插入或更新变量
    // type: 'global' 表示全局变量，这样可以在提示词中通过 {{getvar::xxx}} 访问
    await th.insertOrAssignVariables(variables, { type: 'global' })
    console.log('全局变量设置成功:', variables)
  } catch (error) {
    console.error('设置全局变量失败:', error)
  }
}

/**
 * 发送生成请求并获取结果
 * @param prompt 提示词
 * @param onStream 接收流式数据的回调函数
 * @returns 生成的最终文本
 */
export const generateStory = async (prompt: string, onStream?: (text: string) => void): Promise<string> => {
  const th = getTavernHelper()
  if (!th) {
    // 模拟生成，用于本地测试
    return new Promise((resolve) => {
      let text = '（模拟生成）你踏上了宝可梦世界的旅途...'
      if (onStream) {
        let current = ''
        let i = 0
        const timer = setInterval(() => {
          if (i < text.length) {
            current += text[i]
            onStream(current)
            i++
          } else {
            clearInterval(timer)
            resolve(text)
          }
        }, 50)
      } else {
        setTimeout(() => resolve(text), 1000)
      }
    })
  }

  try {
    // 如果有流式回调，监听流式事件
    let stopStreamListener: (() => void) | null = null
    if (onStream && th.eventOn && th.iframe_events) {
      const listener = th.eventOn(th.iframe_events.STREAM_TOKEN_RECEIVED_FULLY, (text: string) => {
        onStream(text)
      })
      stopStreamListener = listener.stop
    }

    // 调用 generate 函数
    // should_silence: true 表示静默生成，不会在酒馆聊天界面显示
    // should_stream: !!onStream 表示是否启用流式传输
    const result = await th.generate({
      user_input: prompt,
      should_silence: true,
      should_stream: !!onStream,
      // 注入提示词，确保 AI 知道当前是游戏开局
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

    // 停止监听
    if (stopStreamListener) {
      stopStreamListener()
    }

    return result
  } catch (error) {
    console.error('生成剧情失败:', error)
    return '生成剧情失败，请检查网络或 API 设置。'
  }
}