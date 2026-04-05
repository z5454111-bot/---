import { defineStore } from 'pinia'
import { ref } from 'vue'

// 难度类型定义
export type DifficultyLevel = 'peaceful' | 'easy' | 'normal' | 'hard' | 'extreme'
export type Gender = 'boy' | 'girl' | 'other'

// 玩家状态管理，使用 persistedstate 插件自动保存到 localStorage
export const usePlayerStore = defineStore(
  'player',
  () => {
    // 玩家名称
    const name = ref<string>('小智')
    // 玩家金钱
    const money = ref<number>(3000)
    // 初始点数 (用于购买出身、能力等)
    const initialPoints = ref<number>(0)
    // 游戏难度
    const difficulty = ref<DifficultyLevel>('normal')
    
    // 角色基本信息
    const gender = ref<Gender>('boy')
    const age = ref<number>(10)
    
    // 角色初始城镇 (出身)
    const background = ref<string>('真新镇')
    
    // 玩家种族值 (人类也是宝可梦的一种！)
    const stats = ref({
      hp: 5,      // HP (体力)
      atk: 5,     // 攻击 (物理伤害)
      def: 5,     // 防御 (物理抗性)
      spa: 5,     // 特攻 (特殊伤害/超能力)
      spd: 5,     // 特防 (特殊抗性/精神力)
      spe: 5      // 速度 (出手顺序/敏捷)
    })

    // 玩家初始天赋列表
    const talents = ref<string[]>([])

    // 更新玩家名称
    const setName = (newName: string) => {
      name.value = newName
    }

    // 设置游戏难度和初始点数
    const setDifficulty = (level: DifficultyLevel, points: number) => {
      difficulty.value = level
      initialPoints.value = points
    }
    
    // 设置基本信息
    const setBasicInfo = (newGender: Gender, newAge: number) => {
      gender.value = newGender
      age.value = newAge
    }
    
    // 设置出身和能力
    const setTraits = (newBackground: string, newStats: typeof stats.value, remainingPoints: number) => {
      background.value = newBackground
      stats.value = { ...newStats }
      initialPoints.value = remainingPoints
    }

    // 设置天赋
    const setTalents = (newTalents: string[], remainingPoints: number) => {
      talents.value = [...newTalents]
      initialPoints.value = remainingPoints
    }

    return {
      name,
      money,
      initialPoints,
      difficulty,
      gender,
      age,
      background,
      stats,
      talents,
      setName,
      setDifficulty,
      setBasicInfo,
      setTraits,
      setTalents
    }
  },
  {
    // 开启持久化
    persist: true,
  }
)