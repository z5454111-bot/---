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
 * 检查是否在酒馆环境中
 */
export const isTavernEnv = (): boolean => {
  return typeof window !== 'undefined' && !!window.TavernHelper;
};

/**
 * 设置聊天变量
 * @param variables 变量对象
 */
export const setChatVariables = async (variables: Record<string, any>) => {
  if (!isTavernEnv()) {
    console.warn('不在酒馆环境中，跳过设置变量:', variables);
    return;
  }
  try {
    // 酒馆助手的 insertOrAssignVariables 可能是同步的，也可能是异步的
    // 根据最新文档，insertOrAssignVariables 是全局函数，而不是 TavernHelper 的方法
    const result = window.insertOrAssignVariables(variables, { type: 'chat' });
    if (result instanceof Promise) {
      await result;
    }
    console.log('成功设置酒馆变量:', variables);
  } catch (error) {
    console.error('设置酒馆变量失败:', error);
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
    // 监听流式输出
    const eventReturn = window.TavernHelper.eventOn(
      'js_stream_token_received_fully', // iframe_events.STREAM_TOKEN_RECEIVED_FULLY
      (text: string) => {
        onStream(text);
      }
    );
    stopStreamListener = eventReturn.stop;
  }

  try {
    const result = await window.TavernHelper.generate({
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
  window.TavernHelper.stopAllGeneration();
};