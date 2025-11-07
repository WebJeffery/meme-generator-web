<script setup lang="ts">
import type { MemeInfo } from '@/api/types/meme'
import { getMemeDetail, getSimilarMemes } from '@/api/meme'
import MemeCard from '@/components/meme-card/meme-card.vue'
import { useMemeStore } from '@/store/meme'
import { previewImage } from '@/utils/image'
import { saveImageToAlbum, showShareMenu } from '@/utils/share'

definePage({
  style: {
    navigationBarTitleText: '生成结果',
  },
})

// 状态管理
const memeStore = useMemeStore()

// 表情包信息
const meme = ref<MemeInfo | null>(null)

// 相似表情包列表
const similarMemes = ref<MemeInfo[]>([])

// 是否正在重新生成
const isRegenerating = ref(false)

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

// 重新生成
function handleRegenerate() {
  if (!meme.value)
    return

  isRegenerating.value = true

  // 模拟重新生成（实际应该调用API）
  setTimeout(() => {
    isRegenerating.value = false
    uni.showToast({
      title: '重新生成成功',
      icon: 'success',
    })
    // 重新加载详情
    if (meme.value) {
      loadMemeDetail(meme.value.id)
    }
  }, 2000)
}

// 编辑（跳转到编辑页）
function handleEdit() {
  if (!meme.value)
    return
  uni.navigateTo({
    url: `/pages/edit/index?id=${meme.value.id}`,
  })
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
    // 更新状态
    memeStore.addMeme(meme.value)
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

// 长按保存
function handleLongPress() {
  handleSave()
}

// 点击相似表情包
function handleSimilarClick(similarMeme: MemeInfo) {
  // 跳转到该表情包的详情页
  uni.redirectTo({
    url: `/pages/generate/result?id=${similarMeme.id}`,
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
    // 如果没有ID，尝试从状态管理中获取最新的
    const latestMeme = memeStore.generateHistory[0]
    if (latestMeme) {
      meme.value = latestMeme
      loadSimilarMemes(latestMeme.id)
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
  }
})
</script>

<template>
  <view class="result-page min-h-screen bg-gray-50">
    <!-- 表情包预览区域 -->
    <view class="preview-section bg-white px-4 py-6">
      <view
        v-if="meme"
        class="flex flex-col items-center"
      >
        <!-- 表情包大图 -->
        <view
          class="meme-preview mb-6 overflow-hidden rounded-12px bg-gray-100"
          @click="handlePreview"
          @longpress="handleLongPress"
        >
          <image
            :src="meme.imageUrl"
            mode="aspectFit"
            class="w-full"
            :style="{ minHeight: '400px' }"
          />
        </view>

        <!-- 操作按钮区域 -->
        <view class="action-buttons grid grid-cols-2 w-full gap-3">
          <wd-button
            :loading="isRegenerating"
            :disabled="isRegenerating"
            @click="handleRegenerate"
          >
            重新生成
          </wd-button>
          <wd-button
            type="primary"
            @click="handleEdit"
          >
            编辑
          </wd-button>
          <wd-button
            type="primary"
            @click="handleShare"
          >
            分享
          </wd-button>
          <wd-button
            type="primary"
            @click="handleSave"
          >
            保存
          </wd-button>
        </view>
      </view>

      <!-- 加载状态 -->
      <view
        v-else
        class="flex items-center justify-center py-20"
      >
        <wd-loading />
      </view>
    </view>

    <!-- 相关推荐 -->
    <view
      v-if="similarMemes.length > 0"
      class="similar-section px-4 py-6"
    >
      <view class="mb-4 text-16px text-gray-800 font-bold">
        相关推荐
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
.result-page {
  .meme-preview {
    max-width: 100%;
    touch-action: none;
  }

  .action-buttons {
    max-width: 600rpx;
  }
}
</style>
