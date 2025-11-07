/**
 * 表情包状态管理
 */
import type { MemeInfo } from '@/api/types/meme'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMemeStore = defineStore(
  'meme',
  () => {
    // 我的表情包列表
    const myMemeList = ref<MemeInfo[]>([])

    // 生成历史（最近生成的）
    const generateHistory = ref<MemeInfo[]>([])

    // 收藏列表
    const favoriteList = ref<MemeInfo[]>([])

    // 添加表情包到我的列表
    const addMeme = (meme: MemeInfo) => {
      // 检查是否已存在
      const exists = myMemeList.value.find(item => item.id === meme.id)
      if (!exists) {
        myMemeList.value.unshift(meme)
        // 同时添加到生成历史
        generateHistory.value.unshift(meme)
        // 限制历史记录数量
        if (generateHistory.value.length > 100) {
          generateHistory.value = generateHistory.value.slice(0, 100)
        }
      }
    }

    // 从我的列表删除表情包
    const removeMeme = (id: number) => {
      const index = myMemeList.value.findIndex(item => item.id === id)
      if (index > -1) {
        myMemeList.value.splice(index, 1)
      }
      // 同时从收藏列表删除
      const favoriteIndex = favoriteList.value.findIndex(item => item.id === id)
      if (favoriteIndex > -1) {
        favoriteList.value.splice(favoriteIndex, 1)
      }
    }

    // 更新表情包信息
    const updateMeme = (id: number, updates: Partial<MemeInfo>) => {
      const meme = myMemeList.value.find(item => item.id === id)
      if (meme) {
        Object.assign(meme, updates)
      }
      // 同时更新收藏列表中的
      const favoriteMeme = favoriteList.value.find(item => item.id === id)
      if (favoriteMeme) {
        Object.assign(favoriteMeme, updates)
      }
    }

    // 切换收藏状态
    const toggleFavorite = (id: number, isFavorite: boolean) => {
      const meme = myMemeList.value.find(item => item.id === id)
      if (meme) {
        meme.isFavorite = isFavorite
        if (isFavorite) {
          // 添加到收藏列表
          const exists = favoriteList.value.find(item => item.id === id)
          if (!exists) {
            favoriteList.value.unshift(meme)
          }
        }
        else {
          // 从收藏列表移除
          const index = favoriteList.value.findIndex(item => item.id === id)
          if (index > -1) {
            favoriteList.value.splice(index, 1)
          }
        }
      }
    }

    // 清空我的表情包列表
    const clearMyMemeList = () => {
      myMemeList.value = []
    }

    // 清空生成历史
    const clearGenerateHistory = () => {
      generateHistory.value = []
    }

    // 清空收藏列表
    const clearFavoriteList = () => {
      favoriteList.value = []
    }

    // 获取统计数据
    const getStats = () => {
      return {
        totalCount: myMemeList.value.length,
        favoriteCount: favoriteList.value.length,
        generateCount: generateHistory.value.length,
      }
    }

    return {
      myMemeList,
      generateHistory,
      favoriteList,
      addMeme,
      removeMeme,
      updateMeme,
      toggleFavorite,
      clearMyMemeList,
      clearGenerateHistory,
      clearFavoriteList,
      getStats,
    }
  },
  {
    persist: true,
  },
)
