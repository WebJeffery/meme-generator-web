<script setup lang="ts">
import type { MemeInfo } from '@/api/types/meme'
import { useMemeStore } from '@/store/meme'

definePage({
  style: {
    navigationBarTitleText: '编辑表情包',
  },
})

// 状态管理
const memeStore = useMemeStore()

// 编辑的表情包
const meme = ref<MemeInfo | null>(null)

// 编辑的文字
const editText = ref('')

// 当前编辑模式：text-文字，filter-滤镜，sticker-贴纸
const editMode = ref<'text' | 'filter' | 'sticker'>('text')

// 滤镜列表
const filters = ref([
  { name: '原图', value: 'none' },
  { name: '黑白', value: 'grayscale' },
  { name: '怀旧', value: 'sepia' },
  { name: '明亮', value: 'brightness' },
  { name: '对比', value: 'contrast' },
])

// 当前选中的滤镜
const selectedFilter = ref('none')

// 页面参数
const pageParams = ref<{ id?: string }>({})

// 加载表情包
function loadMeme() {
  const id = pageParams.value.id
  if (id) {
    // 从状态管理中查找
    const found = memeStore.myMemeList.find(item => item.id === Number(id))
    if (found) {
      meme.value = found
      editText.value = found.text
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
  else {
    // 如果没有ID，尝试从状态管理中获取最新的
    const latestMeme = memeStore.generateHistory[0]
    if (latestMeme) {
      meme.value = latestMeme
      editText.value = latestMeme.text
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
}

// 保存编辑
async function handleSave() {
  if (!meme.value)
    return

  try {
    // 更新表情包文字
    if (meme.value) {
      memeStore.updateMeme(meme.value.id, {
        text: editText.value,
      })
    }

    uni.showToast({
      title: '保存成功',
      icon: 'success',
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
  catch (error) {
    console.error('保存失败', error)
    uni.showToast({
      title: '保存失败',
      icon: 'none',
    })
  }
}

// 取消编辑
function handleCancel() {
  uni.navigateBack()
}

// 页面加载
onLoad((options) => {
  pageParams.value = options || {}
  loadMeme()
})
</script>

<template>
  <view class="edit-page min-h-screen bg-gray-50">
    <!-- 预览区域 -->
    <view
      v-if="meme"
      class="preview-section bg-white px-4 py-6"
    >
      <view class="preview-image mb-6 overflow-hidden rounded-12px bg-gray-100">
        <image
          :src="meme.imageUrl"
          mode="aspectFit"
          class="w-full"
          :style="{ minHeight: '400px' }"
          :class="{
            'filter-grayscale': selectedFilter === 'grayscale',
            'filter-sepia': selectedFilter === 'sepia',
            'filter-brightness': selectedFilter === 'brightness',
            'filter-contrast': selectedFilter === 'contrast',
          }"
        />
      </view>

      <!-- 编辑工具栏 -->
      <view class="edit-toolbar mb-6">
        <view class="mb-3 flex items-center gap-2">
          <view
            v-for="item in [
              { value: 'text', label: '文字', icon: 'i-carbon-text' },
              { value: 'filter', label: '滤镜', icon: 'i-carbon-image' },
            ]"
            :key="item.value"
            class="tool-item flex items-center gap-1 rounded-20px px-4 py-2 text-14px"
            :class="{
              'bg-primary text-white': editMode === item.value,
              'bg-gray-100 text-gray-600': editMode !== item.value,
            }"
            @click="editMode = item.value as 'text' | 'filter'"
          >
            <view
              :class="item.icon"
              class="text-16px"
            />
            <text>{{ item.label }}</text>
          </view>
        </view>

        <!-- 文字编辑 -->
        <view
          v-if="editMode === 'text'"
          class="text-edit"
        >
          <wd-textarea
            v-model="editText"
            :maxlength="50"
            placeholder="编辑文字"
            :auto-height="true"
            :rows="2"
          />
        </view>

        <!-- 滤镜选择 -->
        <view
          v-if="editMode === 'filter'"
          class="filter-edit"
        >
          <scroll-view
            class="flex"
            scroll-x
            show-scrollbar="false"
          >
            <view class="flex gap-2">
              <view
                v-for="filter in filters"
                :key="filter.value"
                class="filter-item flex-shrink-0 rounded-12px bg-gray-100 px-4 py-2 text-14px"
                :class="{
                  'bg-primary text-white': selectedFilter === filter.value,
                  'text-gray-600': selectedFilter !== filter.value,
                }"
                @click="selectedFilter = filter.value"
              >
                {{ filter.name }}
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons flex gap-3">
        <wd-button
          block
          @click="handleCancel"
        >
          取消
        </wd-button>
        <wd-button
          type="primary"
          block
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
</template>

<style scoped lang="scss">
.edit-page {
  padding-bottom: 40rpx;

  .tool-item {
    transition: all 0.2s;

    &:active {
      transform: scale(0.95);
    }
  }

  .filter-item {
    transition: all 0.2s;

    &:active {
      transform: scale(0.95);
    }
  }

  // 滤镜效果（基础实现，实际需要更复杂的图片处理）
  .filter-grayscale {
    filter: grayscale(100%);
  }

  .filter-sepia {
    filter: sepia(100%);
  }

  .filter-brightness {
    filter: brightness(1.2);
  }

  .filter-contrast {
    filter: contrast(1.2);
  }
}
</style>
