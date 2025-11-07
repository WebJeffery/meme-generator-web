<script setup lang="ts">
import type { MemeStyle } from '@/api/types/meme'
import type { TemplateInfo } from '@/api/types/template'
import { generateMemeByTemplate } from '@/api/meme'
import { getSimilarTemplates, getTemplateDetail } from '@/api/template'
import StyleSelector from '@/components/style-selector/style-selector.vue'
import TemplateCard from '@/components/template-card/template-card.vue'
import { useMemeStore } from '@/store/meme'

definePage({
  style: {
    navigationBarTitleText: '模板详情',
  },
})

// 状态管理
const memeStore = useMemeStore()

// 模板详情
const template = ref<TemplateInfo | null>(null)

// 编辑的文字
const editText = ref('')

// 选中的风格
const selectedStyle = ref<MemeStyle>('cute')

// 是否正在生成
const isGenerating = ref(false)

// 相似模板列表
const similarTemplates = ref<TemplateInfo[]>([])

// 页面参数
const pageParams = ref<{ id?: string }>({})

// 加载模板详情
async function loadTemplateDetail(id: number) {
  try {
    const detail = await getTemplateDetail({ id })
    template.value = detail
    // 设置默认文字
    editText.value = detail.defaultText || ''
    // 加载相似模板
    loadSimilarTemplates(id)
  }
  catch (error) {
    console.error('加载模板详情失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
}

// 加载相似模板
async function loadSimilarTemplates(templateId: number) {
  try {
    const list = await getSimilarTemplates(templateId, 4)
    similarTemplates.value = list
  }
  catch (error) {
    console.error('加载相似模板失败', error)
  }
}

// 处理风格变化
function handleStyleChange(style: MemeStyle) {
  selectedStyle.value = style
}

// 生成表情包
async function handleGenerate() {
  if (!template.value)
    return

  // 验证输入
  if (!editText.value.trim()) {
    uni.showToast({
      title: '请输入文字',
      icon: 'none',
    })
    return
  }

  isGenerating.value = true

  try {
    // 调用生成接口
    const result = await generateMemeByTemplate({
      text: editText.value.trim(),
      style: selectedStyle.value,
      templateId: template.value.id,
      templateText: editText.value.trim(),
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

// 点击相似模板
function handleSimilarClick(similarTemplate: TemplateInfo) {
  // 跳转到该模板的详情页
  uni.redirectTo({
    url: `/pages/template/detail?id=${similarTemplate.id}`,
  })
}

// 页面加载
onLoad((options) => {
  pageParams.value = options || {}
  const id = options?.id
  if (id) {
    loadTemplateDetail(Number(id))
  }
  else {
    uni.showToast({
      title: '模板不存在',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})
</script>

<template>
  <view class="template-detail-page min-h-screen bg-gray-50">
    <!-- 模板预览区域 -->
    <view
      v-if="template"
      class="preview-section bg-white px-4 py-6"
    >
      <!-- 模板大图 -->
      <view class="template-preview mb-6 overflow-hidden rounded-12px bg-gray-100">
        <image
          :src="template.imageUrl"
          mode="aspectFit"
          class="w-full"
          :style="{ minHeight: '400px' }"
        />
      </view>

      <!-- 模板信息 -->
      <view class="template-info mb-6">
        <view class="mb-2 text-20px text-gray-800 font-bold">
          {{ template.name }}
        </view>
        <view
          v-if="template.description"
          class="text-14px text-gray-600"
        >
          {{ template.description }}
        </view>
      </view>

      <!-- 文字输入框 -->
      <view class="mb-6">
        <view class="mb-3 text-14px text-gray-600">
          编辑文字：
        </view>
        <wd-textarea
          v-model="editText"
          :maxlength="50"
          placeholder="输入要替换的文字"
          :auto-height="true"
          :rows="2"
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
      <wd-button
        type="primary"
        :loading="isGenerating"
        :disabled="isGenerating || !editText.trim()"
        block
        @click="handleGenerate"
      >
        {{ isGenerating ? 'AI正在生成中...' : '生成表情包' }}
      </wd-button>
    </view>

    <!-- 加载状态 -->
    <view
      v-else
      class="flex items-center justify-center py-20"
    >
      <wd-loading />
    </view>

    <!-- 相似模板推荐 -->
    <view
      v-if="similarTemplates.length > 0"
      class="similar-section px-4 py-6"
    >
      <view class="mb-4 text-16px text-gray-800 font-bold">
        相似模板
      </view>
      <scroll-view
        class="flex"
        scroll-x
        show-scrollbar="false"
      >
        <view class="flex gap-3">
          <view
            v-for="similarTemplate in similarTemplates"
            :key="similarTemplate.id"
            class="flex-shrink-0"
          >
            <TemplateCard
              :template="similarTemplate"
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
.template-detail-page {
  padding-bottom: 40rpx;
}
</style>
