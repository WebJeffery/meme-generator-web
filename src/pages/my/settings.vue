<script setup lang="ts">
import { logout } from '@/api/login'
import { useTokenStore } from '@/store/token'
import { useUserStore } from '@/store/user'

definePage({
  style: {
    navigationBarTitleText: '设置',
  },
})

// 用户状态管理
const userStore = useUserStore()

// Token状态管理
const tokenStore = useTokenStore()

// 通知设置
const notificationSettings = ref({
  push: true,
  sound: true,
})

// 存储信息
const storageInfo = ref({
  cacheSize: '0MB',
  imageCount: 0,
})

// 应用版本
const appVersion = ref('1.0.0')

// 获取存储信息
function getStorageInfo() {
  try {
    const info = uni.getStorageInfoSync()
    storageInfo.value = {
      cacheSize: `${(info.keys.length * 0.1).toFixed(2)}MB`, // 估算
      imageCount: info.keys.length,
    }
  }
  catch (error) {
    console.error('获取存储信息失败', error)
  }
}

// 修改昵称
function handleEditNickname() {
  uni.showModal({
    title: '修改昵称',
    editable: true,
    placeholderText: '请输入新昵称',
    success: (res) => {
      if (res.confirm && res.content) {
        // 这里应该调用API更新昵称
        userStore.setUserInfo({
          ...userStore.userInfo,
          nickname: res.content,
        })
        uni.showToast({
          title: '修改成功',
          icon: 'success',
        })
      }
    },
  })
}

// 修改头像
function handleEditAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      // 这里应该上传头像到服务器
      userStore.setUserAvatar(tempFilePath)
      uni.showToast({
        title: '修改成功',
        icon: 'success',
      })
    },
  })
}

// 清理缓存
function handleClearCache() {
  uni.showModal({
    title: '提示',
    content: '确定要清理缓存吗？',
    success: (res) => {
      if (res.confirm) {
        try {
          uni.clearStorageSync()
          getStorageInfo()
          uni.showToast({
            title: '清理成功',
            icon: 'success',
          })
        }
        catch (error) {
          console.error('清理缓存失败', error)
          uni.showToast({
            title: '清理失败',
            icon: 'none',
          })
        }
      }
    },
  })
}

// 退出登录
function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await logout()
          // 清除用户信息
          userStore.clearUserInfo()
          tokenStore.clearToken()
          // 跳转到登录页
          uni.reLaunch({
            url: '/pages/auth/login',
          })
        }
        catch (error) {
          console.error('退出登录失败', error)
          // 即使API失败，也清除本地数据
          userStore.clearUserInfo()
          tokenStore.clearToken()
          uni.reLaunch({
            url: '/pages/auth/login',
          })
        }
      }
    },
  })
}

// 跳转到帮助中心
function handleHelp() {
  uni.navigateTo({
    url: '/pages/help/index',
  })
}

// 查看隐私政策
function handlePrivacy() {
  uni.showToast({
    title: '隐私政策功能开发中',
    icon: 'none',
  })
}

// 查看用户协议
function handleAgreement() {
  uni.showToast({
    title: '用户协议功能开发中',
    icon: 'none',
  })
}

// 页面加载
onLoad(() => {
  getStorageInfo()
})
</script>

<template>
  <view class="settings-page min-h-screen bg-gray-50">
    <!-- 账号设置 -->
    <view class="settings-section bg-white px-4 py-4">
      <view class="mb-3 text-14px text-gray-500">
        账号设置
      </view>
      <view
        class="setting-item flex items-center justify-between border-b border-gray-100 py-4"
        @click="handleEditNickname"
      >
        <view class="flex items-center gap-3">
          <view class="i-carbon-user text-20px text-gray-600" />
          <text class="text-16px text-gray-800">昵称</text>
        </view>
        <view class="flex items-center gap-2">
          <text class="text-14px text-gray-500">{{ userStore.userInfo.nickname || '未设置' }}</text>
          <view class="i-carbon-chevron-right text-20px text-gray-400" />
        </view>
      </view>
      <view
        class="setting-item flex items-center justify-between py-4"
        @click="handleEditAvatar"
      >
        <view class="flex items-center gap-3">
          <view class="i-carbon-image text-20px text-gray-600" />
          <text class="text-16px text-gray-800">头像</text>
        </view>
        <view class="flex items-center gap-2">
          <image
            :src="userStore.userInfo.avatar"
            mode="aspectFill"
            class="h-40rpx w-40rpx rounded-full"
          />
          <view class="i-carbon-chevron-right text-20px text-gray-400" />
        </view>
      </view>
    </view>

    <!-- 通知设置 -->
    <view class="settings-section mt-4 bg-white px-4 py-4">
      <view class="mb-3 text-14px text-gray-500">
        通知设置
      </view>
      <view class="setting-item flex items-center justify-between border-b border-gray-100 py-4">
        <view class="flex items-center gap-3">
          <view class="i-carbon-notification text-20px text-gray-600" />
          <text class="text-16px text-gray-800">推送通知</text>
        </view>
        <wd-switch
          v-model="notificationSettings.push"
          size="20px"
        />
      </view>
      <view class="setting-item flex items-center justify-between py-4">
        <view class="flex items-center gap-3">
          <view class="i-carbon-volume-up text-20px text-gray-600" />
          <text class="text-16px text-gray-800">声音提醒</text>
        </view>
        <wd-switch
          v-model="notificationSettings.sound"
          size="20px"
        />
      </view>
    </view>

    <!-- 存储设置 -->
    <view class="settings-section mt-4 bg-white px-4 py-4">
      <view class="mb-3 text-14px text-gray-500">
        存储设置
      </view>
      <view class="setting-item flex items-center justify-between py-4">
        <view class="flex items-center gap-3">
          <view class="i-carbon-storage text-20px text-gray-600" />
          <text class="text-16px text-gray-800">缓存大小</text>
        </view>
        <view class="flex items-center gap-2">
          <text class="text-14px text-gray-500">{{ storageInfo.cacheSize }}</text>
        </view>
      </view>
      <view
        class="setting-item flex items-center justify-between py-4"
        @click="handleClearCache"
      >
        <view class="flex items-center gap-3">
          <view class="i-carbon-trash-can text-20px text-gray-600" />
          <text class="text-16px text-gray-800">清理缓存</text>
        </view>
        <view class="i-carbon-chevron-right text-20px text-gray-400" />
      </view>
    </view>

    <!-- 关于 -->
    <view class="settings-section mt-4 bg-white px-4 py-4">
      <view class="mb-3 text-14px text-gray-500">
        关于
      </view>
      <view
        class="setting-item flex items-center justify-between border-b border-gray-100 py-4"
        @click="handleHelp"
      >
        <view class="flex items-center gap-3">
          <view class="i-carbon-help text-20px text-gray-600" />
          <text class="text-16px text-gray-800">帮助中心</text>
        </view>
        <view class="i-carbon-chevron-right text-20px text-gray-400" />
      </view>
      <view
        class="setting-item flex items-center justify-between border-b border-gray-100 py-4"
        @click="handlePrivacy"
      >
        <view class="flex items-center gap-3">
          <view class="i-carbon-document text-20px text-gray-600" />
          <text class="text-16px text-gray-800">隐私政策</text>
        </view>
        <view class="i-carbon-chevron-right text-20px text-gray-400" />
      </view>
      <view
        class="setting-item flex items-center justify-between border-b border-gray-100 py-4"
        @click="handleAgreement"
      >
        <view class="flex items-center gap-3">
          <view class="i-carbon-document text-20px text-gray-600" />
          <text class="text-16px text-gray-800">用户协议</text>
        </view>
        <view class="i-carbon-chevron-right text-20px text-gray-400" />
      </view>
      <view class="setting-item flex items-center justify-between py-4">
        <view class="flex items-center gap-3">
          <view class="i-carbon-information text-20px text-gray-600" />
          <text class="text-16px text-gray-800">版本信息</text>
        </view>
        <text class="text-14px text-gray-500">v{{ appVersion }}</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="settings-section mt-4 bg-white px-4 py-4">
      <wd-button
        type="error"
        block
        @click="handleLogout"
      >
        退出登录
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.settings-page {
  padding-bottom: 40rpx;

  .setting-item {
    transition: background-color 0.2s;

    &:active {
      background-color: #f5f5f5;
    }
  }
}
</style>
