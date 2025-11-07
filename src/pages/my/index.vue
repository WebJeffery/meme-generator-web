<script setup lang="ts">
import { useMemeStore } from '@/store/meme'
import { useUserStore } from '@/store/user'

definePage({
  style: {
    navigationBarTitleText: '个人中心',
  },
})

// 用户状态管理
const userStore = useUserStore()

// 表情包状态管理
const memeStore = useMemeStore()

// 统计数据
const stats = computed(() => memeStore.getStats())

// 跳转到我的表情包
function handleMyEmoji() {
  uni.navigateTo({
    url: '/pages/my/emoji',
  })
}

// 跳转到我的收藏
function handleMyFavorite() {
  uni.navigateTo({
    url: '/pages/my/favorite',
  })
}

// 跳转到历史记录
function handleHistory() {
  uni.navigateTo({
    url: '/pages/my/history',
  })
}

// 跳转到会员中心
function handleVip() {
  uni.navigateTo({
    url: '/pages/my/vip',
  })
}

// 跳转到设置
function handleSettings() {
  uni.navigateTo({
    url: '/pages/my/settings',
  })
}

// 编辑个人信息
function handleEditProfile() {
  uni.showToast({
    title: '编辑功能开发中',
    icon: 'none',
  })
}
</script>

<template>
  <view class="my-page min-h-screen bg-gray-50">
    <!-- 用户信息卡片 -->
    <view class="user-card bg-white px-4 py-6">
      <view class="flex items-center gap-4">
        <!-- 头像 -->
        <view
          class="avatar-wrapper relative"
          @click="handleEditProfile"
        >
          <image
            :src="userStore.userInfo.avatar"
            mode="aspectFill"
            class="h-80rpx w-80rpx rounded-full"
          />
          <view class="absolute bottom-0 right-0 h-24rpx w-24rpx border-2 border-white rounded-full bg-primary" />
        </view>

        <!-- 用户信息 -->
        <view class="flex-1">
          <view class="flex items-center gap-2">
            <text class="text-18px text-gray-800 font-bold">
              {{ userStore.userInfo.nickname || userStore.userInfo.username || '未登录' }}
            </text>
            <!-- 会员标识 -->
            <view class="rounded-4px bg-yellow-400 px-2 py-1">
              <text class="text-10px text-white">VIP</text>
            </view>
          </view>
          <text class="mt-1 text-14px text-gray-500">
            ID: {{ userStore.userInfo.userId }}
          </text>
        </view>

        <!-- 编辑按钮 -->
        <view
          class="i-carbon-edit text-20px text-gray-600"
          @click="handleEditProfile"
        />
      </view>

      <!-- 数据统计 -->
      <view class="stats-section mt-6 flex items-center justify-around rounded-12px bg-gray-50 px-4 py-4">
        <view class="flex flex-col items-center">
          <text class="text-20px text-primary font-bold">{{ stats.totalCount }}</text>
          <text class="mt-1 text-12px text-gray-500">生成次数</text>
        </view>
        <view class="h-40rpx w-1px bg-gray-200" />
        <view class="flex flex-col items-center">
          <text class="text-20px text-primary font-bold">{{ stats.favoriteCount }}</text>
          <text class="mt-1 text-12px text-gray-500">收藏数量</text>
        </view>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="function-list mt-4 bg-white">
      <view
        class="function-item flex items-center justify-between border-b border-gray-100 px-4 py-4"
        @click="handleMyEmoji"
      >
        <view class="flex items-center gap-3">
          <view class="i-carbon-image text-20px text-primary" />
          <text class="text-16px text-gray-800">我的表情包</text>
        </view>
        <view class="i-carbon-chevron-right text-20px text-gray-400" />
      </view>

      <view
        class="function-item flex items-center justify-between border-b border-gray-100 px-4 py-4"
        @click="handleMyFavorite"
      >
        <view class="flex items-center gap-3">
          <view class="i-carbon-favorite text-20px text-primary" />
          <text class="text-16px text-gray-800">我的收藏</text>
        </view>
        <view class="i-carbon-chevron-right text-20px text-gray-400" />
      </view>

      <view
        class="function-item flex items-center justify-between border-b border-gray-100 px-4 py-4"
        @click="handleHistory"
      >
        <view class="flex items-center gap-3">
          <view class="i-carbon-time text-20px text-primary" />
          <text class="text-16px text-gray-800">历史记录</text>
        </view>
        <view class="i-carbon-chevron-right text-20px text-gray-400" />
      </view>

      <view
        class="function-item flex items-center justify-between border-b border-gray-100 px-4 py-4"
        @click="handleVip"
      >
        <view class="flex items-center gap-3">
          <view class="i-carbon-star text-20px text-yellow-500" />
          <text class="text-16px text-gray-800">会员中心</text>
        </view>
        <view class="i-carbon-chevron-right text-20px text-gray-400" />
      </view>

      <view
        class="function-item flex items-center justify-between px-4 py-4"
        @click="handleSettings"
      >
        <view class="flex items-center gap-3">
          <view class="i-carbon-settings text-20px text-gray-600" />
          <text class="text-16px text-gray-800">设置</text>
        </view>
        <view class="i-carbon-chevron-right text-20px text-gray-400" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.my-page {
  padding-bottom: 120rpx; // 为底部TabBar留出空间

  .user-card {
    .avatar-wrapper {
      position: relative;
    }
  }

  .function-item {
    transition: background-color 0.2s;

    &:active {
      background-color: #f5f5f5;
    }
  }
}
</style>
