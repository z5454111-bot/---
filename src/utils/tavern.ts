/**
 * 封装与 SillyTavern 酒馆助手的交互
 */

// 声明全局变量，避免 TS 报错
declare global {
  interface Window {
    TavernHelper: any;
    iframe_events: any;
    tavern_events: any;
    insertOrAssignVariables: (variables: Record<string, any>, option: any) => any;
  }
}

/**
 * 递归向上查找 TavernHelper，兼容多层 iframe 嵌套
 * 最多查找 5 层，防止无限循环
 */
export const getNativeTavernHelper = (): any | null => {
  if (typeof window === 'undefined') return null;

  // 先检查当前 window
  if ((window as any).TavernHelper) {
    return (window as any).TavernHelper;
  }

  try {
    // 尝试直接访问 top（最顶层窗口）
    if (window.top && window.top !== window) {
      if ((window.top as any).TavernHelper) {
        return (window.top as any).TavernHelper;
      }
    }
  } catch (e) {
    console.warn('[Tavern检测] 访问window.top失败（跨域）:', e);
  }

  // 逐层向上查找，最多 5 层
  let currentWindow: Window = window;
  for (let i = 0; i < 5; i++) {
    try {
      if (currentWindow.parent && currentWindow.parent !== currentWindow) {
        // 尝试访问 parent 的属性，如果跨域会抛出异常
        const parentWin = currentWindow.parent as any;
        // 检查是否有 TavernHelper
        if (parentWin.TavernHelper) {
          return parentWin.TavernHelper;
        }
        currentWindow = currentWindow.parent;
      } else {
        break;
      }
    } catch (e) {
      console.warn(`[Tavern检测] 访问第${i + 1}层parent失败（跨域）:`, e);
      // 跨域时，无法直接访问 parent 的属性，只能通过 postMessage 通信
      // 这里不再继续向上查找，因为已经跨域了
      break;
    }
  }

  return null;
};

/**
 * 检查是否在酒馆环境中
 */
export const isTavernEnv = (): boolean => {
  return !!getNativeTavernHelper();
};

/**
 * 获取当前角色卡的头像路径
 * @returns 头像路径字符串，如果获取失败则返回 null
 */
export const getCharAvatarPath = (): string | null => {
  const helper = getNativeTavernHelper();
  if (helper && typeof helper.getCharAvatarPath === 'function') {
    return helper.getCharAvatarPath();
  }
  console.warn('无法获取角色头像路径：未找到 TavernHelper 或 getCharAvatarPath 方法');
  return null;
};

/**
 * 设置聊天变量
 * @param variables 变量对象
 */
export const setChatVariables = async (variables: Record<string, any>) => {
  console.log('准备设置酒馆变量:', variables);

  // 方案A：通过 postMessage 跨域发送给父窗口（最稳妥的跨域方案）
  if (window.top !== window) {
    window.top?.postMessage({
      type: 'TAVERN_SET_VARIABLES',
      variables: variables
    }, '*');
    console.log('已通过 postMessage 发送变量给顶层窗口');
  }

  // 方案B：尝试直接调用（如果扩展注入了环境）
  if (!isTavernEnv()) {
    console.warn('未检测到直接的酒馆环境注入，依赖 postMessage 通信。');
    return;
  }
  
  try {
    let result;
    const helper = getNativeTavernHelper();
    if (typeof window.insertOrAssignVariables === 'function') {
      result = window.insertOrAssignVariables(variables, { type: 'chat' });
    } else if (helper && typeof helper.insertOrAssignVariables === 'function') {
      result = helper.insertOrAssignVariables(variables, { type: 'chat' });
    } else {
      console.warn('当前环境中找不到 insertOrAssignVariables 函数，依赖 postMessage 通信。');
      return;
    }

    if (result instanceof Promise) {
      await result;
    }
    console.log('成功直接设置酒馆变量:', variables);
  } catch (error) {
    console.error('直接设置酒馆变量失败:', error);
  }
};

/**
 * 发起 AI 生成请求
 * @param userInput 用户输入
 * @param onStream 流式回调函数
 * @returns 最终生成的文本
 */
export const generateResponse = async (
  userInput: string,
  onStream?: (text: string) => void
): Promise<string> => {
  if (!isTavernEnv()) {
    console.warn('不在酒馆环境中，模拟回复');
    // 模拟延迟和流式回复
    if (onStream) {
      const mockText = '这是一个模拟的 AI 回复。';
      for (let i = 1; i <= mockText.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onStream(mockText.substring(0, i));
      }
      return mockText;
    }
    return '这是一个模拟的 AI 回复。';
  }

  let stopStreamListener: (() => void) | null = null;

  if (onStream) {
    const helper = getNativeTavernHelper();
    // 监听流式输出
    const eventReturn = helper.eventOn(
      'js_stream_token_received_fully', // iframe_events.STREAM_TOKEN_RECEIVED_FULLY
      (text: string) => {
        onStream(text);
      }
    );
    stopStreamListener = eventReturn.stop;
  }

  try {
    const helper = getNativeTavernHelper();
    const result = await helper.generate({
      user_input: userInput,
      should_stream: !!onStream,
    });
    return result;
  } catch (error) {
    console.error('AI 生成失败:', error);
    throw error;
  } finally {
    if (stopStreamListener) {
      stopStreamListener();
    }
  }
};

/**
 * 停止所有生成
 */
export const stopGeneration = () => {
  if (!isTavernEnv()) return;
  const helper = getNativeTavernHelper();
  if (helper && typeof helper.stopAllGeneration === 'function') {
    helper.stopAllGeneration();
  }
};