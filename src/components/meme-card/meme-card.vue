<script setup lang="ts">
import type { MemeInfo } from '@/api/types/meme'

/**
 * 表情包卡片组件
 * 用于展示表情包图片，支持长按操作、点击预览
 */
interface Props {
  /** 表情包信息 */
  meme: MemeInfo
  /** 是否显示操作按钮 */
  showActions?: boolean
  /** 卡片大小：small-小，medium-中，large-大 */
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  showActions: false,
  size: 'medium',
})

const emit = defineEmits<{
  /** 点击卡片 */
  click: [meme: MemeInfo]
  /** 长按卡片 */
  longpress: [meme: MemeInfo]
  /** 点击预览 */
  preview: [meme: MemeInfo]
  /** 点击分享 */
  share: [meme: MemeInfo]
  /** 点击删除 */
  delete: [meme: MemeInfo]
  /** 点击收藏 */
  favorite: [meme: MemeInfo]
}>()

// 卡片尺寸映射
const sizeMap = {
  small: 'h-200rpx w-200rpx',
  medium: 'h-300rpx w-300rpx',
  large: 'h-400rpx w-400rpx',
}

// 处理点击
function handleClick() {
  emit('click', props.meme)
  emit('preview', props.meme)
}

// 处理长按
function handleLongPress() {
  emit('longpress', props.meme)
  // 显示操作菜单
  uni.showActionSheet({
    itemList: ['分享', props.meme.isFavorite ? '取消收藏' : '收藏', '删除'],
    success: (res) => {
      if (res.tapIndex === 0) {
        emit('share', props.meme)
      }
      else if (res.tapIndex === 1) {
        emit('favorite', props.meme)
      }
      else if (res.tapIndex === 2) {
        emit('delete', props.meme)
      }
    },
  })
}

// 处理分享
function handleShare(e: Event) {
  e.stopPropagation()
  emit('share', props.meme)
}

// 处理删除
function handleDelete(e: Event) {
  e.stopPropagation()
  uni.showModal({
    title: '提示',
    content: '确定要删除这个表情包吗？',
    success: (res) => {
      if (res.confirm) {
        emit('delete', props.meme)
      }
    },
  })
}

// 处理收藏
function handleFavorite(e: Event) {
  e.stopPropagation()
  emit('favorite', props.meme)
}
</script>

<template>
  <view class="meme-card relative overflow-hidden rounded-12px bg-white shadow-sm">
    <!-- 表情包图片 -->
    <view
      :class="sizeMap[size]"
      class="relative flex items-center justify-center overflow-hidden"
      @click="handleClick"
      @longpress="handleLongPress"
    >
      <image
        :src="meme.imageUrl"
        mode="aspectFill"
        class="h-full w-full"
        :lazy-load="true"
      />
      <!-- 收藏标识 -->
      <view
        v-if="meme.isFavorite"
        class="absolute right-2 top-2"
      >
        <view class="i-carbon-favorite-filled text-20px text-red-500" />
      </view>
    </view>

    <!-- 操作按钮（可选） -->
    <view
      v-if="showActions"
      class="flex items-center justify-between px-2 py-2"
    >
      <view class="flex items-center gap-2">
        <view
          class="flex items-center gap-1"
          @click.stop="handleFavorite"
        >
          <view
            :class="meme.isFavorite ? 'i-carbon-favorite-filled text-red-500' : 'i-carbon-favorite text-gray-400'"
            class="text-16px"
          />
        </view>
        <view
          class="flex items-center gap-1"
          @click.stop="handleShare"
        >
          <view class="i-carbon-share text-16px text-gray-600" />
        </view>
      </view>
      <view
        class="flex items-center gap-1"
        @click.stop="handleDelete"
      >
        <view class="i-carbon-trash-can text-16px text-red-500" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.meme-card {
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}
</style>
