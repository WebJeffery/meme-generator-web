<script setup lang="ts">
import type { MemeInfo } from '@/api/types/meme'
import { deleteMeme, favoriteMeme, getMyMemeList } from '@/api/meme'
import EmptyState from '@/components/empty-state/empty-state.vue'
import MemeCard from '@/components/meme-card/meme-card.vue'
import { useMemeStore } from '@/store/meme'
import { previewImage } from '@/utils/image'
import { showShareMenu } from '@/utils/share'

definePage({
  style: {
    navigationBarTitleText: '我的表情包',
  },
})

// 状态管理
const memeStore = useMemeStore()

// 表情包列表
const memeList = ref<MemeInfo[]>([])

// 是否加载中
const isLoading = ref(false)

// 时间范围筛选
const timeRange = ref<'all' | '7days' | '30days'>('all')

// 加载表情包列表
async function loadMemeList() {
  isLoading.value = true

  try {
    const result = await getMyMemeList({
      timeRange: timeRange.value,
      page: 1,
      pageSize: 100, // 一次性加载所有
    })

    memeList.value = result.list
  }
  catch (error) {
    console.error('加载表情包列表失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
  finally {
    isLoading.value = false
  }
}

// 切换时间范围
function handleTimeRangeChange(range: 'all' | '7days' | '30days') {
  if (timeRange.value === range)
    return
  timeRange.value = range
  loadMemeList()
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

// 删除
async function handleDelete(meme: MemeInfo) {
  try {
    await deleteMeme({ id: meme.id })
    // 从状态管理中删除
    memeStore.removeMeme(meme.id)
    // 重新加载列表
    loadMemeList()
    uni.showToast({
      title: '删除成功',
      icon: 'success',
    })
  }
  catch (error) {
    console.error('删除失败', error)
    uni.showToast({
      title: '删除失败',
      icon: 'none',
    })
  }
}

// 收藏/取消收藏
async function handleFavorite(meme: MemeInfo) {
  try {
    const isFavorite = !meme.isFavorite
    await favoriteMeme({ id: meme.id, isFavorite })
    // 更新状态管理
    memeStore.toggleFavorite(meme.id, isFavorite)
    // 更新列表中的状态
    const item = memeList.value.find(item => item.id === meme.id)
    if (item) {
      item.isFavorite = isFavorite
    }
    uni.showToast({
      title: isFavorite ? '收藏成功' : '取消收藏',
      icon: 'success',
    })
  }
  catch (error) {
    console.error('操作失败', error)
    uni.showToast({
      title: '操作失败',
      icon: 'none',
    })
  }
}

// 下拉刷新
function handleRefresh() {
  loadMemeList()
}

// 页面加载
onLoad(() => {
  loadMemeList()
})

// 页面显示时刷新（从其他页面返回时）
onShow(() => {
  loadMemeList()
})
</script>

<template>
  <view class="my-emoji-page min-h-screen bg-gray-50">
    <!-- 筛选栏 -->
    <view class="filter-bar bg-white px-4 py-3">
      <view class="flex items-center gap-2">
        <view
          v-for="item in [
            { value: 'all', label: '全部' },
            { value: '7days', label: '最近7天' },
            { value: '30days', label: '最近30天' },
          ]"
          :key="item.value"
          class="filter-item rounded-20px px-4 py-2 text-14px"
          :class="{
            'bg-primary text-white': timeRange === item.value,
            'bg-gray-100 text-gray-600': timeRange !== item.value,
          }"
          @click="handleTimeRangeChange(item.value as 'all' | '7days' | '30days')"
        >
          {{ item.label }}
        </view>
      </view>
    </view>

    <!-- 表情包列表 -->
    <view class="meme-list px-4 py-4">
      <view
        v-if="memeList.length > 0"
        class="grid grid-cols-2 gap-4"
      >
        <view
          v-for="meme in memeList"
          :key="meme.id"
        >
          <MemeCard
            :meme="meme"
            :show-actions="true"
            size="medium"
            @click="handleMemeClick"
            @longpress="handleMemeLongPress"
            @share="handleShare"
            @delete="handleDelete"
            @favorite="handleFavorite"
          />
        </view>
      </view>

      <!-- 空状态 -->
      <EmptyState
        v-else-if="!isLoading"
        icon="i-carbon-folder"
        title="还没有生成表情包"
        description="快去生成一个吧"
        button-text="去生成"
        @click="uni.switchTab({ url: '/pages/index/index' })"
      />

      <!-- 加载状态 -->
      <view
        v-if="isLoading && memeList.length === 0"
        class="flex items-center justify-center py-20"
      >
        <wd-loading />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.my-emoji-page {
  padding-bottom: 40rpx;

  .filter-item {
    transition: all 0.2s;

    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
