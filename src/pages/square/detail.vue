<script setup lang="ts">
import type { MemeInfo } from '@/api/types/meme'
import { favoriteMeme, getMemeDetail, getSimilarMemes } from '@/api/meme'
import MemeCard from '@/components/meme-card/meme-card.vue'
import { useMemeStore } from '@/store/meme'
import { previewImage } from '@/utils/image'
import { saveImageToAlbum, showShareMenu } from '@/utils/share'

definePage({
  style: {
    navigationBarTitleText: '表情包详情',
  },
})

// 状态管理
const memeStore = useMemeStore()

// 表情包信息
const meme = ref<MemeInfo | null>(null)

// 相似表情包列表
const similarMemes = ref<MemeInfo[]>([])

// 页面参数
const pageParams = ref<{ id?: string }>({})

// 加载表情包详情
async function loadMemeDetail(id: number) {
  try {
    const detail = await getMemeDetail(id)
    meme.value = detail
    // 加载相似表情包
    loadSimilarMemes(id)
  }
  catch (error) {
    console.error('加载表情包详情失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
}

// 加载相似表情包
async function loadSimilarMemes(memeId: number) {
  try {
    const list = await getSimilarMemes(memeId, 4)
    similarMemes.value = list
  }
  catch (error) {
    console.error('加载相似表情包失败', error)
  }
}

// 点赞（使用收藏代替）
async function handleLike() {
  if (!meme.value)
    return

  try {
    const isFavorite = !meme.value.isFavorite
    await favoriteMeme({ id: meme.value.id, isFavorite })
    memeStore.toggleFavorite(meme.value.id, isFavorite)
    if (meme.value) {
      meme.value.isFavorite = isFavorite
      meme.value.likeCount = (meme.value.likeCount || 0) + (isFavorite ? 1 : -1)
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
async function handleFavorite() {
  if (!meme.value)
    return

  try {
    const isFavorite = !meme.value.isFavorite
    await favoriteMeme({ id: meme.value.id, isFavorite })
    memeStore.toggleFavorite(meme.value.id, isFavorite)
    if (meme.value) {
      meme.value.isFavorite = isFavorite
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
function handleShare() {
  if (!meme.value)
    return
  showShareMenu(meme.value.imageUrl, meme.value.text)
}

// 保存
async function handleSave() {
  if (!meme.value)
    return

  try {
    await saveImageToAlbum(meme.value.imageUrl)
  }
  catch (error) {
    console.error('保存失败', error)
  }
}

// 预览图片
function handlePreview() {
  if (!meme.value)
    return
  previewImage([meme.value.imageUrl], 0)
}

// 点击相似表情包
function handleSimilarClick(similarMeme: MemeInfo) {
  uni.redirectTo({
    url: `/pages/square/detail?id=${similarMeme.id}`,
  })
}

// 页面加载
onLoad((options) => {
  pageParams.value = options || {}
  const id = options?.id
  if (id) {
    loadMemeDetail(Number(id))
  }
  else {
    uni.showToast({
      title: '表情包不存在',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})
</script>

<template>
  <view class="square-detail-page min-h-screen bg-gray-50">
    <!-- 表情包预览区域 -->
    <view
      v-if="meme"
      class="preview-section bg-white px-4 py-6"
    >
      <view
        class="meme-preview mb-6 overflow-hidden rounded-12px bg-gray-100"
        @click="handlePreview"
      >
        <image
          :src="meme.imageUrl"
          mode="aspectFit"
          class="w-full"
          :style="{ minHeight: '400px' }"
        />
      </view>

      <!-- 用户信息（模拟） -->
      <view class="user-info mb-6 flex items-center gap-3">
        <image
          src="/static/images/default-avatar.png"
          mode="aspectFill"
          class="h-60rpx w-60rpx rounded-full"
        />
        <view class="flex-1">
          <text class="text-14px text-gray-800 font-medium">用户{{ meme.id }}</text>
        </view>
      </view>

      <!-- 互动按钮 -->
      <view class="interaction-buttons mb-6 flex items-center justify-around">
        <view
          class="flex flex-col items-center gap-1"
          @click="handleLike"
        >
          <view
            :class="meme.isFavorite ? 'i-carbon-favorite-filled text-red-500' : 'i-carbon-favorite text-gray-400'"
            class="text-32px"
          />
          <text class="text-12px text-gray-500">{{ meme.likeCount || 0 }}</text>
        </view>
        <view
          class="flex flex-col items-center gap-1"
          @click="handleFavorite"
        >
          <view
            :class="meme.isFavorite ? 'i-carbon-favorite-filled text-primary' : 'i-carbon-favorite text-gray-400'"
            class="text-32px"
          />
          <text class="text-12px text-gray-500">收藏</text>
        </view>
        <view
          class="flex flex-col items-center gap-1"
          @click="handleShare"
        >
          <view class="i-carbon-share text-32px text-gray-400" />
          <text class="text-12px text-gray-500">分享</text>
        </view>
        <view
          class="flex flex-col items-center gap-1"
          @click="handleSave"
        >
          <view class="i-carbon-download text-32px text-gray-400" />
          <text class="text-12px text-gray-500">保存</text>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view
      v-else
      class="flex items-center justify-center py-20"
    >
      <wd-loading />
    </view>

    <!-- 相似推荐 -->
    <view
      v-if="similarMemes.length > 0"
      class="similar-section px-4 py-6"
    >
      <view class="mb-4 text-16px text-gray-800 font-bold">
        相似推荐
      </view>
      <scroll-view
        class="flex"
        scroll-x
        show-scrollbar="false"
      >
        <view class="flex gap-3">
          <view
            v-for="similarMeme in similarMemes"
            :key="similarMeme.id"
            class="flex-shrink-0"
          >
            <MemeCard
              :meme="similarMeme"
              size="small"
              @click="handleSimilarClick"
            />
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.square-detail-page {
  padding-bottom: 40rpx;

  .meme-preview {
    touch-action: none;
  }

  .interaction-buttons {
    .flex {
      transition: opacity 0.2s;

      &:active {
        opacity: 0.7;
      }
    }
  }
}
</style>
