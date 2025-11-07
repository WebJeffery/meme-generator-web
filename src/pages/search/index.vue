<script setup lang="ts">
import type { MemeInfo } from '@/api/types/meme'
import type { TemplateInfo } from '@/api/types/template'
import { getMyMemeList } from '@/api/meme'
import { getTemplateList } from '@/api/template'
import EmptyState from '@/components/empty-state/empty-state.vue'
import MemeCard from '@/components/meme-card/meme-card.vue'
import TemplateCard from '@/components/template-card/template-card.vue'

definePage({
  style: {
    navigationBarTitleText: '搜索',
  },
})

// 搜索关键词
const searchKeyword = ref('')

// 搜索结果类型：all-全部，meme-表情包，template-模板
const resultType = ref<'all' | 'meme' | 'template'>('all')

// 表情包搜索结果
const memeResults = ref<MemeInfo[]>([])

// 模板搜索结果
const templateResults = ref<TemplateInfo[]>([])

// 是否正在搜索
const isSearching = ref(false)

// 热门搜索词
const hotKeywords = ref([
  '工作累',
  '加油打工人',
  '我要下班',
  '周末快乐',
  '心情不好',
  '生日快乐',
])

// 搜索历史
const searchHistory = ref<string[]>([])

// 加载搜索历史
function loadSearchHistory() {
  try {
    const history = uni.getStorageSync('searchHistory')
    if (history) {
      searchHistory.value = JSON.parse(history)
    }
  }
  catch (error) {
    console.error('加载搜索历史失败', error)
  }
}

// 保存搜索历史
function saveSearchHistory(keyword: string) {
  if (!keyword.trim())
    return

  // 移除重复项
  const index = searchHistory.value.indexOf(keyword)
  if (index > -1) {
    searchHistory.value.splice(index, 1)
  }

  // 添加到开头
  searchHistory.value.unshift(keyword)

  // 限制数量
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }

  // 保存到本地
  try {
    uni.setStorageSync('searchHistory', JSON.stringify(searchHistory.value))
  }
  catch (error) {
    console.error('保存搜索历史失败', error)
  }
}

// 执行搜索
async function performSearch(keyword: string) {
  if (!keyword.trim()) {
    memeResults.value = []
    templateResults.value = []
    return
  }

  isSearching.value = true

  try {
    // 搜索表情包
    if (resultType.value === 'all' || resultType.value === 'meme') {
      const memeRes = await getMyMemeList({
        keyword,
        page: 1,
        pageSize: 20,
      })
      memeResults.value = memeRes.list
    }

    // 搜索模板
    if (resultType.value === 'all' || resultType.value === 'template') {
      const templateRes = await getTemplateList({
        keyword,
        page: 1,
        pageSize: 20,
      })
      templateResults.value = templateRes.list
    }
  }
  catch (error) {
    console.error('搜索失败', error)
    uni.showToast({
      title: '搜索失败',
      icon: 'none',
    })
  }
  finally {
    isSearching.value = false
  }
}

// 处理搜索
function handleSearch() {
  if (!searchKeyword.value.trim()) {
    uni.showToast({
      title: '请输入搜索关键词',
      icon: 'none',
    })
    return
  }

  saveSearchHistory(searchKeyword.value)
  performSearch(searchKeyword.value)
}

// 点击热门搜索词
function handleHotKeywordClick(keyword: string) {
  searchKeyword.value = keyword
  handleSearch()
}

// 点击搜索历史
function handleHistoryClick(keyword: string) {
  searchKeyword.value = keyword
  handleSearch()
}

// 清除搜索历史
function handleClearHistory() {
  uni.showModal({
    title: '提示',
    content: '确定要清除搜索历史吗？',
    success: (res) => {
      if (res.confirm) {
        searchHistory.value = []
        try {
          uni.removeStorageSync('searchHistory')
        }
        catch (error) {
          console.error('清除搜索历史失败', error)
        }
      }
    },
  })
}

// 切换结果类型
function handleResultTypeChange(type: 'all' | 'meme' | 'template') {
  resultType.value = type
  if (searchKeyword.value.trim()) {
    performSearch(searchKeyword.value)
  }
}

// 页面加载
onLoad(() => {
  loadSearchHistory()
})
</script>

<template>
  <view class="search-page min-h-screen bg-gray-50">
    <!-- 搜索栏 -->
    <view class="search-bar bg-white px-4 py-3">
      <wd-search
        v-model="searchKeyword"
        placeholder="搜索表情包或模板"
        @search="handleSearch"
        @confirm="handleSearch"
      />
    </view>

    <!-- 搜索结果类型切换 -->
    <view
      v-if="searchKeyword.trim()"
      class="result-type-tabs flex items-center gap-2 bg-white px-4 py-3"
    >
      <view
        v-for="item in [
          { value: 'all', label: '全部' },
          { value: 'meme', label: '表情包' },
          { value: 'template', label: '模板' },
        ]"
        :key="item.value"
        class="tab-item rounded-20px px-4 py-2 text-14px"
        :class="{
          'bg-primary text-white': resultType === item.value,
          'bg-gray-100 text-gray-600': resultType !== item.value,
        }"
        @click="handleResultTypeChange(item.value as 'all' | 'meme' | 'template')"
      >
        {{ item.label }}
      </view>
    </view>

    <!-- 搜索结果 -->
    <view
      v-if="searchKeyword.trim()"
      class="search-results px-4 py-4"
    >
      <!-- 加载状态 -->
      <view
        v-if="isSearching"
        class="flex items-center justify-center py-20"
      >
        <wd-loading />
      </view>

      <!-- 表情包结果 -->
      <view
        v-else-if="resultType === 'all' || resultType === 'meme'"
        class="meme-results"
      >
        <view
          v-if="memeResults.length > 0"
          class="mb-4 text-16px text-gray-800 font-bold"
        >
          表情包 ({{ memeResults.length }})
        </view>
        <view
          v-if="memeResults.length > 0"
          class="grid grid-cols-2 gap-4"
        >
          <view
            v-for="meme in memeResults"
            :key="meme.id"
          >
            <MemeCard
              :meme="meme"
              size="medium"
            />
          </view>
        </view>
        <EmptyState
          v-else-if="!isSearching"
          icon="i-carbon-search"
          title="没有找到相关表情包"
          description="试试其他关键词"
        />
      </view>

      <!-- 模板结果 -->
      <view
        v-else-if="resultType === 'all' || resultType === 'template'"
        class="template-results"
      >
        <view
          v-if="templateResults.length > 0"
          class="mb-4 text-16px text-gray-800 font-bold"
        >
          模板 ({{ templateResults.length }})
        </view>
        <view
          v-if="templateResults.length > 0"
          class="grid grid-cols-2 gap-4"
        >
          <view
            v-for="template in templateResults"
            :key="template.id"
          >
            <TemplateCard
              :template="template"
              size="medium"
            />
          </view>
        </view>
        <EmptyState
          v-else-if="!isSearching"
          icon="i-carbon-search"
          title="没有找到相关模板"
          description="试试其他关键词"
        />
      </view>
    </view>

    <!-- 搜索前：热门搜索和历史记录 -->
    <view
      v-else
      class="search-before px-4 py-6"
    >
      <!-- 热门搜索 -->
      <view class="mb-6">
        <view class="mb-3 text-16px text-gray-800 font-bold">
          热门搜索
        </view>
        <view class="flex flex-wrap gap-2">
          <view
            v-for="keyword in hotKeywords"
            :key="keyword"
            class="keyword-tag rounded-20px bg-gray-100 px-4 py-2 text-14px text-gray-600"
            @click="handleHotKeywordClick(keyword)"
          >
            {{ keyword }}
          </view>
        </view>
      </view>

      <!-- 搜索历史 -->
      <view v-if="searchHistory.length > 0">
        <view class="mb-3 flex items-center justify-between">
          <text class="text-16px text-gray-800 font-bold">搜索历史</text>
          <text
            class="text-14px text-gray-500"
            @click="handleClearHistory"
          >
            清除
          </text>
        </view>
        <view class="flex flex-wrap gap-2">
          <view
            v-for="keyword in searchHistory"
            :key="keyword"
            class="keyword-tag rounded-20px bg-gray-100 px-4 py-2 text-14px text-gray-600"
            @click="handleHistoryClick(keyword)"
          >
            {{ keyword }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.search-page {
  padding-bottom: 40rpx;

  .tab-item {
    transition: all 0.2s;

    &:active {
      transform: scale(0.95);
    }
  }

  .keyword-tag {
    transition: all 0.2s;

    &:active {
      background-color: #e5e7eb;
      transform: scale(0.95);
    }
  }
}
</style>
