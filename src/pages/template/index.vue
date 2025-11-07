<script setup lang="ts">
import type { TemplateCategory, TemplateInfo } from '@/api/types/template'
import { getTemplateCategories, getTemplateList } from '@/api/template'
import EmptyState from '@/components/empty-state/empty-state.vue'
import TemplateCard from '@/components/template-card/template-card.vue'

definePage({
  style: {
    navigationBarTitleText: '模板库',
  },
})

// 分类列表
const categories = ref(getTemplateCategories())

// 当前选中的分类
const activeCategory = ref<TemplateCategory>('all')

// 模板列表
const templateList = ref<TemplateInfo[]>([])

// 是否加载中
const isLoading = ref(false)

// 是否加载完成
const isFinished = ref(false)

// 分页参数
const pageParams = ref({
  page: 1,
  pageSize: 20,
})

// 搜索关键词
const searchKeyword = ref('')

// 排序方式
const sortType = ref<'hot' | 'latest'>('hot')

// 加载模板列表
async function loadTemplateList(reset: boolean = false) {
  if (isLoading.value || isFinished.value)
    return

  isLoading.value = true

  try {
    if (reset) {
      pageParams.value.page = 1
      templateList.value = []
      isFinished.value = false
    }

    const result = await getTemplateList({
      page: pageParams.value.page,
      pageSize: pageParams.value.pageSize,
      category: activeCategory.value,
      keyword: searchKeyword.value || undefined,
      sort: sortType.value,
    })

    if (reset) {
      templateList.value = result.list
    }
    else {
      templateList.value.push(...result.list)
    }

    // 判断是否加载完成
    if (result.list.length < pageParams.value.pageSize) {
      isFinished.value = true
    }
    else {
      pageParams.value.page++
    }
  }
  catch (error) {
    console.error('加载模板列表失败', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
  finally {
    isLoading.value = false
  }
}

// 切换分类
function handleCategoryChange(category: TemplateCategory) {
  if (activeCategory.value === category)
    return
  activeCategory.value = category
  loadTemplateList(true)
}

// 搜索
function handleSearch() {
  loadTemplateList(true)
}

// 切换排序
function handleSortChange(sort: 'hot' | 'latest') {
  if (sortType.value === sort)
    return
  sortType.value = sort
  loadTemplateList(true)
}

// 点击模板
function handleTemplateClick(template: TemplateInfo) {
  uni.navigateTo({
    url: `/pages/template/detail?id=${template.id}`,
  })
}

// 下拉刷新
function handleRefresh() {
  loadTemplateList(true)
}

// 上拉加载更多
function handleLoadMore() {
  loadTemplateList()
}

// 页面加载
onLoad(() => {
  loadTemplateList(true)
})
</script>

<template>
  <view class="template-index-page min-h-screen bg-gray-50">
    <!-- 搜索栏 -->
    <view class="search-bar bg-white px-4 py-3">
      <wd-search
        v-model="searchKeyword"
        placeholder="搜索模板"
        @search="handleSearch"
        @confirm="handleSearch"
      />
    </view>

    <!-- 分类导航 -->
    <view class="category-nav bg-white px-4 py-3">
      <scroll-view
        class="flex"
        scroll-x
        show-scrollbar="false"
      >
        <view class="flex items-center gap-2">
          <view
            v-for="category in categories"
            :key="category.value"
            class="category-item flex flex-shrink-0 items-center gap-1 rounded-20px px-4 py-2"
            :class="{
              'bg-primary text-white': activeCategory === category.value,
              'bg-gray-100 text-gray-600': activeCategory !== category.value,
            }"
            @click="handleCategoryChange(category.value)"
          >
            <view
              v-if="category.icon"
              :class="category.icon"
              class="text-14px"
            />
            <text class="text-14px font-medium">{{ category.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 排序栏 -->
    <view class="sort-bar flex items-center justify-between bg-white px-4 py-2">
      <text class="text-14px text-gray-600">共{{ templateList.length }}个模板</text>
      <view class="flex items-center gap-4">
        <view
          class="sort-item flex items-center gap-1"
          :class="{ 'text-primary': sortType === 'hot' }"
          @click="handleSortChange('hot')"
        >
          <text class="text-14px">热门</text>
        </view>
        <view
          class="sort-item flex items-center gap-1"
          :class="{ 'text-primary': sortType === 'latest' }"
          @click="handleSortChange('latest')"
        >
          <text class="text-14px">最新</text>
        </view>
      </view>
    </view>

    <!-- 模板列表 -->
    <view class="template-list px-4 py-4">
      <view
        v-if="templateList.length > 0"
        class="grid grid-cols-2 gap-4"
      >
        <view
          v-for="template in templateList"
          :key="template.id"
          @click="handleTemplateClick(template)"
        >
          <TemplateCard
            :template="template"
            size="medium"
          />
        </view>
      </view>

      <!-- 空状态 -->
      <EmptyState
        v-else-if="!isLoading"
        icon="i-carbon-template"
        title="暂无模板"
        description="试试其他分类或关键词"
      />

      <!-- 加载状态 -->
      <view
        v-if="isLoading && templateList.length === 0"
        class="flex items-center justify-center py-20"
      >
        <wd-loading />
      </view>
    </view>

    <!-- 加载更多提示 -->
    <view
      v-if="templateList.length > 0"
      class="load-more flex items-center justify-center py-4"
    >
      <text
        v-if="isLoading"
        class="text-14px text-gray-500"
      >
        加载中...
      </text>
      <text
        v-else-if="isFinished"
        class="text-14px text-gray-500"
      >
        没有更多了
      </text>
      <text
        v-else
        class="text-14px text-primary"
        @click="handleLoadMore"
      >
        加载更多
      </text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.template-index-page {
  padding-bottom: 120rpx; // 为底部TabBar留出空间

  .category-item {
    transition: all 0.2s;

    &:active {
      transform: scale(0.95);
    }
  }

  .sort-item {
    transition: color 0.2s;

    &:active {
      opacity: 0.7;
    }
  }
}
</style>
