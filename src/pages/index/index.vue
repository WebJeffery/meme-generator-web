<script setup lang="ts">
import type { MemeStyle } from '@/api/types/meme'
import type { TemplateInfo } from '@/api/types/template'
import { generateMemeByText } from '@/api/meme'
import { getHotTemplates } from '@/api/template'
import StyleSelector from '@/components/style-selector/style-selector.vue'
import TemplateCard from '@/components/template-card/template-card.vue'
import { useMemeStore } from '@/store/meme'

defineOptions({
  name: 'Home',
})

definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'AI表情包生成器',
  },
})

// 状态管理
const memeStore = useMemeStore()

// 文字输入
const inputText = ref('')
const maxLength = 50

// 选中的风格
const selectedStyle = ref<MemeStyle>('funny')

// 是否正在生成
const isGenerating = ref(false)

// 快速模板列表
const hotTemplates = ref<TemplateInfo[]>([])

// 加载快速模板
async function loadHotTemplates() {
  try {
    const templates = await getHotTemplates(6)
    hotTemplates.value = templates
  }
  catch (error) {
    console.error('加载快速模板失败', error)
  }
}

// 处理风格变化
function handleStyleChange(style: MemeStyle) {
  selectedStyle.value = style
}

// 生成表情包
async function handleGenerate() {
  // 验证输入
  if (!inputText.value.trim()) {
    uni.showToast({
      title: '请输入文字',
      icon: 'none',
    })
    return
  }

  if (inputText.value.length > maxLength) {
    uni.showToast({
      title: `文字不能超过${maxLength}字`,
      icon: 'none',
    })
    return
  }

  isGenerating.value = true

  try {
    // 调用生成接口
    const result = await generateMemeByText({
      text: inputText.value.trim(),
      style: selectedStyle.value,
    })

    // 保存到状态管理
    memeStore.addMeme(result.meme)

    // 跳转到结果页
    uni.navigateTo({
      url: `/pages/generate/result?id=${result.meme.id}`,
    })
  }
  catch (error) {
    console.error('生成失败', error)
    uni.showToast({
      title: '生成失败，请重试',
      icon: 'none',
    })
  }
  finally {
    isGenerating.value = false
  }
}

// 跳转到搜索页
function handleSearch() {
  uni.navigateTo({
    url: '/pages/search/index',
  })
}

// 跳转到消息页（可选）
function handleMessage() {
  uni.showToast({
    title: '消息功能开发中',
    icon: 'none',
  })
}

// 点击快速模板
function handleTemplateClick(template: TemplateInfo) {
  uni.navigateTo({
    url: `/pages/template/detail?id=${template.id}`,
  })
}

// 页面加载
onLoad(() => {
  loadHotTemplates()
})
</script>

<template>
  <view class="home-page min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <view class="top-nav flex items-center justify-between bg-white px-4 py-3 pt-safe">
      <view class="flex items-center gap-2">
        <image
          src="/static/logo.svg"
          class="h-32rpx w-32rpx"
          mode="aspectFit"
        />
        <text class="text-16px text-gray-800 font-bold">AI表情包</text>
      </view>
      <view class="flex items-center gap-4">
        <view
          class="i-carbon-search text-20px text-gray-600"
          @click="handleSearch"
        />
        <view
          class="i-carbon-notification text-20px text-gray-600"
          @click="handleMessage"
        />
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class="px-4 py-6">
      <!-- 标题 -->
      <view class="mb-6 text-center">
        <text class="text-24px text-gray-800 font-bold">AI表情包生成器</text>
      </view>

      <!-- 文字输入框 -->
      <view class="mb-6">
        <wd-textarea
          v-model="inputText"
          :maxlength="maxLength"
          placeholder="输入文字，AI帮你生成表情包"
          :show-word-limit="true"
          :auto-height="true"
          :rows="3"
        />
      </view>

      <!-- 风格选择器 -->
      <view class="mb-6">
        <view class="mb-3 text-14px text-gray-600">
          选择风格：
        </view>
        <StyleSelector
          :model-value="selectedStyle"
          @change="handleStyleChange"
        />
      </view>

      <!-- 生成按钮 -->
      <view class="mb-8">
        <wd-button
          type="primary"
          :loading="isGenerating"
          :disabled="isGenerating || !inputText.trim()"
          block
          @click="handleGenerate"
        >
          {{ isGenerating ? 'AI正在生成中...' : '生成表情包' }}
        </wd-button>
      </view>

      <!-- 快速模板 -->
      <view v-if="hotTemplates.length > 0">
        <view class="mb-4 flex items-center justify-between">
          <text class="text-16px text-gray-800 font-bold">快速模板</text>
          <view
            class="text-14px text-primary"
            @click="uni.navigateTo({ url: '/pages/template/index' })"
          >
            更多 >
          </view>
        </view>
        <scroll-view
          class="flex"
          scroll-x
          show-scrollbar="false"
        >
          <view class="flex gap-3">
            <view
              v-for="template in hotTemplates"
              :key="template.id"
              class="flex-shrink-0"
            >
              <TemplateCard
                :template="template"
                size="small"
                @click="handleTemplateClick"
              />
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.home-page {
  padding-bottom: 120rpx; // 为底部TabBar留出空间
}
</style>
