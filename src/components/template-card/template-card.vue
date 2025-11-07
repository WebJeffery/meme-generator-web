<script setup lang="ts">
import type { TemplateInfo } from '@/api/types/template'

/**
 * 模板卡片组件
 * 用于展示模板缩略图、标题，点击跳转详情
 */
interface Props {
  /** 模板信息 */
  template: TemplateInfo
  /** 卡片大小：small-小，medium-中，large-大 */
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
})

const emit = defineEmits<{
  /** 点击卡片 */
  click: [template: TemplateInfo]
}>()

// 卡片尺寸映射
const sizeMap = {
  small: 'h-200rpx w-200rpx',
  medium: 'h-300rpx w-300rpx',
  large: 'h-400rpx w-400rpx',
}

// 处理点击
function handleClick() {
  emit('click', props.template)
  // 跳转到模板详情页
  uni.navigateTo({
    url: `/pages/template/detail?id=${props.template.id}`,
  })
}
</script>

<template>
  <view
    class="template-card relative overflow-hidden rounded-12px bg-white shadow-sm"
    @click="handleClick"
  >
    <!-- 模板缩略图 -->
    <view
      :class="sizeMap[size]"
      class="relative flex items-center justify-center overflow-hidden"
    >
      <image
        :src="template.thumbnailUrl"
        mode="aspectFill"
        class="h-full w-full"
        :lazy-load="true"
      />
      <!-- 热门标识 -->
      <view
        v-if="template.isHot"
        class="absolute left-2 top-2 rounded-4px bg-red-500 px-2 py-1"
      >
        <text class="text-10px text-white">热门</text>
      </view>
      <!-- 使用次数 -->
      <view
        v-if="template.useCount"
        class="absolute bottom-2 right-2 flex items-center gap-1 rounded-4px bg-black/50 px-2 py-1"
      >
        <view class="i-carbon-view text-12px text-white" />
        <text class="text-10px text-white">{{ template.useCount }}</text>
      </view>
    </view>

    <!-- 模板信息 -->
    <view class="px-2 py-2">
      <view class="truncate text-14px text-gray-800 font-medium">
        {{ template.name }}
      </view>
      <view
        v-if="template.description"
        class="mt-1 truncate text-12px text-gray-500"
      >
        {{ template.description }}
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.template-card {
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }
}
</style>
