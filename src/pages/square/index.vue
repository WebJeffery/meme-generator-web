<script setup lang="ts">
import type { MemeInfo } from '@/api/types/meme'
import { favoriteMeme, getMyMemeList } from '@/api/meme'
import EmptyState from '@/components/empty-state/empty-state.vue'
import MemeCard from '@/components/meme-card/meme-card.vue'
import { useMemeStore } from '@/store/meme'
import { showShareMenu } from '@/utils/share'

definePage({
  style: {
    navigationBarTitleText: '表情包广场',
  },
})

// 状态管理
const memeStore = useMemeStore()

// 表情包列表
const memeList = ref<MemeInfo[]>([])

// 当前Tab：recommend-推荐，hot-热门，latest-最新
const activeTab = ref<'recommend' | 'hot' | 'latest'>('recommend')

// 是否加载中
const isLoading = ref(false)

// 是否加载完成
const isFinished = ref(false)

// 分页参数
const pageParams = ref({
  page: 1,
  pageSize: 20,
})

// 加载表情包列表
async function loadMemeList(reset: boolean = false) {
  if (isLoading.value || isFinished.value)
    return

  isLoading.value = true

  try {
    if (reset) {
      pageParams.value.page = 1
      memeList.value = []
      isFinished.value = false
    }

    // 这里应该调用广场API，暂时使用我的表情包列表
    const result = await getMyMemeList({
      page: pageParams.value.page,
      pageSize: pageParams.value.pageSize,
    })

    if (reset) {
      memeList.value = result.list
    }
    else {
      memeList.value.push(...result.list)
    }

    // 判断是否加载完成
    if (result.list.length < pageParams.value.pageSize) {
      isFinished.value = true
    }
    else {
      pageParams.value.page++
    }
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

// 切换Tab
function handleTabChange(tab: 'recommend' | 'hot' | 'latest') {
  if (activeTab.value === tab)
    return
  activeTab.value = tab
  loadMemeList(true)
}

// 点击表情包（预览）
function handleMemeClick(meme: MemeInfo) {
  uni.navigateTo({
    url: `/pages/square/detail?id=${meme.id}`,
  })
}

// 点赞（暂时使用收藏代替）
async function handleLike(meme: MemeInfo) {
  try {
    const isFavorite = !meme.isFavorite
    await favoriteMeme({ id: meme.id, isFavorite })
    // 更新状态
    memeStore.toggleFavorite(meme.id, isFavorite)
    // 更新列表中的状态
    const item = memeList.value.find(item => item.id === meme.id)
    if (item) {
      item.isFavorite = isFavorite
      item.likeCount = (item.likeCount || 0) + (isFavorite ? 1 : -1)
    }
    uni.showToast({
      title: isFavorite ? '已点赞' : '已取消',
      icon: 'success',
    })
  }
  catch (error) {
    console.error('操作失败', error)
  }
}

// 收藏
async function handleFavorite(meme: MemeInfo) {
  try {
    const isFavorite = !meme.isFavorite
    await favoriteMeme({ id: meme.id, isFavorite })
    memeStore.toggleFavorite(meme.id, isFavorite)
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

// 下拉刷新
function handleRefresh() {
  loadMemeList(true)
}

// 上拉加载更多
function handleLoadMore() {
  loadMemeList()
}

// 页面加载
onLoad(() => {
  loadMemeList(true)
})
</script>

<template>
  <view class="square-page min-h-screen bg-gray-50">
    <!-- Tab切换 -->
    <view class="tab-bar bg-white px-4 py-3">
      <view class="flex items-center gap-4">
        <view
          v-for="item in [
            { value: 'recommend', label: '推荐' },
            { value: 'hot', label: '热门' },
            { value: 'latest', label: '最新' },
          ]"
          :key="item.value"
          class="tab-item text-16px font-medium"
          :class="{
            'text-primary border-b-2 border-primary': activeTab === item.value,
            'text-gray-600': activeTab !== item.value,
          }"
          @click="handleTabChange(item.value as 'recommend' | 'hot' | 'latest')"
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
            size="medium"
            @click="handleMemeClick"
            @favorite="handleFavorite"
            @share="handleShare"
          />
          <!-- 互动按钮 -->
          <view class="interaction-bar mt-2 flex items-center justify-between px-2">
            <view
              class="flex items-center gap-2"
              @click.stop="handleLike(meme)"
            >
              <view
                :class="meme.isFavorite ? 'i-carbon-favorite-filled text-red-500' : 'i-carbon-favorite text-gray-400'"
                class="text-18px"
              />
              <text class="text-12px text-gray-500">{{ meme.likeCount || 0 }}</text>
            </view>
            <view
              class="flex items-center gap-2"
              @click.stop="handleShare(meme)"
            >
              <view class="i-carbon-share text-18px text-gray-400" />
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <EmptyState
        v-else-if="!isLoading"
        icon="i-carbon-image"
        title="暂无表情包"
        description="快去生成第一个表情包吧"
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

    <!-- 加载更多提示 -->
    <view
      v-if="memeList.length > 0"
      class="load-more flex items-center justify-center py-4"
    >
      <text
        v-if="isLoading"
        class="text-14px text-gray-500"
      >
        加载中...
      </text>
      <text
        v-else-if="isFinished"
        class="text-14px text-gray-500"
      >
        没有更多了
      </text>
      <text
        v-else
        class="text-14px text-primary"
        @click="handleLoadMore"
      >
        加载更多
      </text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.square-page {
  padding-bottom: 120rpx; // 为底部TabBar留出空间

  .tab-item {
    padding-bottom: 8rpx;
    transition: all 0.2s;

    &:active {
      opacity: 0.7;
    }
  }

  .interaction-bar {
    .flex {
      transition: opacity 0.2s;

      &:active {
        opacity: 0.7;
      }
    }
  }
}
</style>
