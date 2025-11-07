<script setup lang="ts">
import type { MemeStyle, MemeStyleConfig } from '@/api/types/meme'

/**
 * 风格选择器组件
 * 横向滚动选择风格（搞笑、可爱、严肃、萌等）
 */
interface Props {
  /** 当前选中的风格 */
  modelValue?: MemeStyle
  /** 是否显示全部选项 */
  showAll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'funny',
  showAll: false,
})

const emit = defineEmits<{
  /** 风格变化 */
  'update:modelValue': [style: MemeStyle]
  /** 选择风格 */
  'change': [style: MemeStyle]
}>()

// 风格配置列表
const styleList: MemeStyleConfig[] = [
  { value: 'funny', label: '搞笑', icon: 'i-carbon-face-satisfied' },
  { value: 'cute', label: '可爱', icon: 'i-carbon-face-satisfied' },
  { value: 'serious', label: '严肃', icon: 'i-carbon-face-neutral' },
  { value: 'adorable', label: '萌', icon: 'i-carbon-face-satisfied' },
  { value: 'happy', label: '开心', icon: 'i-carbon-face-satisfied' },
  { value: 'sad', label: '难过', icon: 'i-carbon-face-dizzy' },
  { value: 'angry', label: '生气', icon: 'i-carbon-face-dizzy' },
]

// 处理风格选择
function handleSelect(style: MemeStyle) {
  emit('update:modelValue', style)
  emit('change', style)
}
</script>

<template>
  <view class="style-selector">
    <scroll-view
      class="flex"
      scroll-x
      show-scrollbar="false"
    >
      <view class="flex items-center gap-2 px-4 py-2">
        <view
          v-for="item in styleList"
          :key="item.value"
          class="style-item flex flex-shrink-0 items-center gap-1 rounded-20px px-4 py-2"
          :class="{
            'bg-primary text-white': modelValue === item.value,
            'bg-gray-100 text-gray-600': modelValue !== item.value,
          }"
          @click="handleSelect(item.value)"
        >
          <view
            v-if="item.icon"
            :class="item.icon"
            class="text-16px"
          />
          <text class="text-14px font-medium">{{ item.label }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.style-selector {
  .style-item {
    transition: all 0.2s;

    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
