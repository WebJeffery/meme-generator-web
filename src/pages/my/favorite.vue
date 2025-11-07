<script setup lang="ts">
import type { MemeInfo } from '@/api/types/meme'
import { favoriteMeme } from '@/api/meme'
import EmptyState from '@/components/empty-state/empty-state.vue'
import MemeCard from '@/components/meme-card/meme-card.vue'
import { useMemeStore } from '@/store/meme'
import { previewImage } from '@/utils/image'
import { showShareMenu } from '@/utils/share'

definePage({
  style: {
    navigationBarTitleText: '我的收藏',
  },
})

// 状态管理
const memeStore = useMemeStore()

// 收藏列表
const favoriteList = computed(() => memeStore.favoriteList)

// 是否加载中
const isLoading = ref(false)

// 加载收藏列表
async function loadFavoriteList() {
  isLoading.value = true
  // 从状态管理中获取收藏列表
  isLoading.value = false
}

// 点击表情包（预览）
function handleMemeClick(meme: MemeInfo) {
  previewImage([meme.imageUrl], 0)
}

// 长按表情包（显示操作菜单）
function handleMemeLongPress(meme: MemeInfo) {
  // 操作菜单在组件内部处理
}

// 分享
async function handleShare(meme: MemeInfo) {
  try {
    showShareMenu(meme.imageUrl, meme.text)
  }
  catch (error) {
    console.error('分享失败', error)
  }
}

// 取消收藏
async function handleUnfavorite(meme: MemeInfo) {
  try {
    await favoriteMeme({ id: meme.id, isFavorite: false })
    // 更新状态管理
    memeStore.toggleFavorite(meme.id, false)
    uni.showToast({
      title: '已取消收藏',
      icon: 'success',
    })
  }
  catch (error) {
    console.error('取消收藏失败', error)
    uni.showToast({
      title: '操作失败',
      icon: 'none',
    })
  }
}

// 页面加载
onLoad(() => {
  loadFavoriteList()
})

// 页面显示时刷新
onShow(() => {
  loadFavoriteList()
})
</script>

<template>
  <view class="my-favorite-page min-h-screen bg-gray-50">
    <!-- 收藏列表 -->
    <view class="favorite-list px-4 py-4">
      <view
        v-if="favoriteList.length > 0"
        class="grid grid-cols-2 gap-4"
      >
        <view
          v-for="meme in favoriteList"
          :key="meme.id"
        >
          <MemeCard
            :meme="meme"
            :show-actions="true"
            size="medium"
            @click="handleMemeClick"
            @longpress="handleMemeLongPress"
            @share="handleShare"
            @favorite="handleUnfavorite"
          />
        </view>
      </view>

      <!-- 空状态 -->
      <EmptyState
        v-else-if="!isLoading"
        icon="i-carbon-favorite"
        title="还没有收藏表情包"
        description="快去收藏喜欢的表情包吧"
        button-text="去浏览"
        @click="uni.switchTab({ url: '/pages/index/index' })"
      />

      <!-- 加载状态 -->
      <view
        v-if="isLoading && favoriteList.length === 0"
        class="flex items-center justify-center py-20"
      >
        <wd-loading />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.my-favorite-page {
  padding-bottom: 40rpx;
}
</style>
