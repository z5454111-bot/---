import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 基础路由配置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Start',
    component: () => import('@/views/Start.vue'), // 懒加载 Start 视图
    meta: {
      title: '开始游戏 - 宝可梦世界',
    },
  },
  {
    path: '/difficulty',
    name: 'Difficulty',
    component: () => import('@/views/Difficulty.vue'),
    meta: {
      title: '选择难度 - 宝可梦世界',
    },
  },
  {
    path: '/character/basic-info',
    name: 'BasicInfo',
    component: () => import('@/views/character/BasicInfo.vue'),
    meta: {
      title: '基本信息 - 宝可梦世界',
    },
  },
  {
    path: '/character/traits',
    name: 'Traits',
    component: () => import('@/views/character/Traits.vue'),
    meta: {
      title: '出身与能力 - 宝可梦世界',
    },
  },
  {
    path: '/character/talents',
    name: 'Talents',
    component: () => import('@/views/character/Talents.vue'),
    meta: {
      title: '初始天赋 - 宝可梦世界',
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'), // 懒加载 Home 视图
    meta: {
      title: '宝可梦世界',
    },
  },
]

const router = createRouter({
  // 使用 hash 模式，适合作为前端卡片嵌入
  history: createWebHashHistory(),
  routes,
})

// 处理动态导入失败的错误（通常是因为发布了新版本导致旧的 chunk 文件被删除，而用户浏览器缓存了旧的 index.html）
router.onError((error) => {
  if (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes('Importing a module script failed')) {
    console.warn('检测到版本更新，正在重新加载页面...');
    // 强制刷新页面以获取最新的资源文件
    window.location.reload();
  }
})

export default router