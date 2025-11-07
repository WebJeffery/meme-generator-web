<script setup lang="ts">
/**
 * 空状态组件
 * 通用空状态展示，支持自定义图标和文字
 */
interface Props {
  /** 图标（可选，使用unocss图标类名） */
  icon?: string
  /** 标题文字 */
  title?: string
  /** 描述文字 */
  description?: string
  /** 按钮文字（可选，显示按钮） */
  buttonText?: string
  /** 图标大小 */
  iconSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'i-carbon-information',
  title: '暂无数据',
  description: '',
  buttonText: '',
  iconSize: '80px',
})

const emit = defineEmits<{
  /** 点击按钮 */
  click: []
}>()

// 处理按钮点击
function handleClick() {
  emit('click')
}
</script>

<template>
  <view class="empty-state flex flex-col items-center justify-center py-20">
    <!-- 图标 -->
    <view
      v-if="icon"
      :class="icon"
      class="text-gray-300"
      :style="{ fontSize: iconSize }"
    />
    <!-- 标题 -->
    <view
      v-if="title"
      class="mt-4 text-16px text-gray-500 font-medium"
    >
      {{ title }}
    </view>
    <!-- 描述 -->
    <view
      v-if="description"
      class="mt-2 text-14px text-gray-400"
    >
      {{ description }}
    </view>
    <!-- 按钮 -->
    <wd-button
      v-if="buttonText"
      class="mt-6"
      type="primary"
      size="small"
      @click="handleClick"
    >
      {{ buttonText }}
    </wd-button>
  </view>
</template>

<style scoped lang="scss">
.empty-state {
  min-height: 400rpx;
}
</style>
