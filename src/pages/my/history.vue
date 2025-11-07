<script setup lang="ts">
import type { MemeInfo } from '@/api/types/meme'
import { generateMemeByText } from '@/api/meme'
import EmptyState from '@/components/empty-state/empty-state.vue'
import MemeCard from '@/components/meme-card/meme-card.vue'
import { useMemeStore } from '@/store/meme'
import { previewImage } from '@/utils/image'
import { showShareMenu } from '@/utils/share'

definePage({
  style: {
    navigationBarTitleText: '历史记录',
  },
})

// 状态管理
const memeStore = useMemeStore()

// 历史记录列表
const historyList = computed(() => memeStore.generateHistory)

// 是否加载中
const isLoading = ref(false)

// 加载历史记录
async function loadHistory() {
  isLoading.value = true
  // 从状态管理中获取历史记录
  isLoading.value = false
}

// 点击表情包（预览）
function handleMemeClick(meme: MemeInfo) {
  previewImage([meme.imageUrl], 0)
}

// 快速重新生成
async function handleRegenerate(meme: MemeInfo) {
  try {
    uni.showLoading({ title: '生成中...' })
    const result = await generateMemeByText({
      text: meme.text,
      style: meme.style,
    })
    // 保存到状态管理
    memeStore.addMeme(result.meme)
    uni.hideLoading()
    // 跳转到结果页
    uni.navigateTo({
      url: `/pages/generate/result?id=${result.meme.id}`,
    })
  }
  catch (error) {
    uni.hideLoading()
    console.error('重新生成失败', error)
    uni.showToast({
      title: '生成失败，请重试',
      icon: 'none',
    })
  }
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

// 清除历史
function handleClearHistory() {
  uni.showModal({
    title: '提示',
    content: '确定要清除所有历史记录吗？',
    success: (res) => {
      if (res.confirm) {
        memeStore.clearGenerateHistory()
        uni.showToast({
          title: '已清除',
          icon: 'success',
        })
      }
    },
  })
}

// 格式化时间
function formatTime(time: string) {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return '今天'
  }
  else if (days === 1) {
    return '昨天'
  }
  else if (days < 7) {
    return `${days}天前`
  }
  else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

// 页面加载
onLoad(() => {
  loadHistory()
})

// 页面显示时刷新
onShow(() => {
  loadHistory()
})
</script>

<template>
  <view class="my-history-page min-h-screen bg-gray-50">
    <!-- 顶部操作栏 -->
    <view
      v-if="historyList.length > 0"
      class="action-bar flex items-center justify-end bg-white px-4 py-3"
    >
      <view
        class="text-14px text-gray-600"
        @click="handleClearHistory"
      >
        清除历史
      </view>
    </view>

    <!-- 历史记录列表 -->
    <view class="history-list px-4 py-4">
      <view
        v-if="historyList.length > 0"
        class="space-y-4"
      >
        <view
          v-for="meme in historyList"
          :key="meme.id"
          class="history-item rounded-12px bg-white p-4 shadow-sm"
        >
          <!-- 时间标签 -->
          <view class="mb-3 text-12px text-gray-500">
            {{ formatTime(meme.createTime) }}
          </view>

          <!-- 表情包卡片 -->
          <view class="flex items-center gap-4">
            <view
              class="flex-shrink-0"
              @click="handleMemeClick(meme)"
            >
              <MemeCard
                :meme="meme"
                size="small"
              />
            </view>

            <!-- 操作按钮 -->
            <view class="flex-1">
              <view class="mb-2 text-14px text-gray-800">
                {{ meme.text }}
              </view>
              <view class="flex items-center gap-2">
                <wd-button
                  size="small"
                  type="primary"
                  @click="handleRegenerate(meme)"
                >
                  重新生成
                </wd-button>
                <wd-button
                  size="small"
                  @click="handleShare(meme)"
                >
                  分享
                </wd-button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <EmptyState
        v-else-if="!isLoading"
        icon="i-carbon-time"
        title="还没有生成历史"
        description="快去生成第一个表情包吧"
        button-text="去生成"
        @click="uni.switchTab({ url: '/pages/index/index' })"
      />

      <!-- 加载状态 -->
      <view
        v-if="isLoading && historyList.length === 0"
        class="flex items-center justify-center py-20"
      >
        <wd-loading />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.my-history-page {
  padding-bottom: 40rpx;

  .history-item {
    transition: transform 0.2s;

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
