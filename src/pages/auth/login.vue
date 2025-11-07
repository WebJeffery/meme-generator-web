<script setup lang="ts">
import { getWxCode, wxLogin } from '@/api/login'
import { useTokenStore } from '@/store/token'
import { useUserStore } from '@/store/user'

definePage({
  style: {
    navigationBarTitleText: '登录',
  },
})

// 用户状态管理
const userStore = useUserStore()

// Token状态管理
const tokenStore = useTokenStore()

// 登录方式：wechat-微信，phone-手机号
const loginType = ref<'wechat' | 'phone'>('wechat')

// 手机号登录表单
const phoneForm = ref({
  phone: '',
  code: '',
})

// 是否正在登录
const isLogging = ref(false)

// 是否正在发送验证码
const isSendingCode = ref(false)

// 倒计时
const countdown = ref(0)

// 微信登录
async function handleWeChatLogin() {
  isLogging.value = true

  try {
    // 获取微信登录凭证
    const wxRes = await getWxCode()
    // 调用后端接口进行微信登录
    const loginRes = await wxLogin({ code: wxRes.code })
    // 保存token
    tokenStore.setToken(loginRes.token)
    // 保存用户信息
    userStore.setUserInfo(loginRes.userInfo)
    // 登录成功
    uni.showToast({
      title: '登录成功',
      icon: 'success',
    })
    // 返回上一页或跳转到首页
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index',
      })
    }, 1500)
  }
  catch (error) {
    console.error('微信登录失败', error)
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'none',
    })
  }
  finally {
    isLogging.value = false
  }
}

// 手机号登录
async function handlePhoneLogin() {
  // 验证手机号
  if (!phoneForm.value.phone) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none',
    })
    return
  }

  if (!/^1[3-9]\d{9}$/.test(phoneForm.value.phone)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
    })
    return
  }

  // 验证验证码
  if (!phoneForm.value.code) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none',
    })
    return
  }

  isLogging.value = true

  try {
    // 调用手机号登录接口（这里使用mock，实际需要对接真实接口）
    uni.showToast({
      title: '手机号登录功能开发中',
      icon: 'none',
    })
    // const loginRes = await phoneLogin(phoneForm.value)
    // tokenStore.setToken(loginRes.token)
    // userStore.setUserInfo(loginRes.userInfo)
  }
  catch (error) {
    console.error('手机号登录失败', error)
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'none',
    })
  }
  finally {
    isLogging.value = false
  }
}

// 发送验证码
async function handleSendCode() {
  // 验证手机号
  if (!phoneForm.value.phone) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none',
    })
    return
  }

  if (!/^1[3-9]\d{9}$/.test(phoneForm.value.phone)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
    })
    return
  }

  if (countdown.value > 0)
    return

  isSendingCode.value = true

  try {
    // 调用发送验证码接口（这里使用mock，实际需要对接真实接口）
    uni.showToast({
      title: '验证码已发送',
      icon: 'success',
    })
    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
  catch (error) {
    console.error('发送验证码失败', error)
    uni.showToast({
      title: '发送失败，请重试',
      icon: 'none',
    })
  }
  finally {
    isSendingCode.value = false
  }
}

// 切换登录方式
function handleLoginTypeChange(type: 'wechat' | 'phone') {
  loginType.value = type
}
</script>

<template>
  <view class="login-page min-h-screen bg-gray-50">
    <!-- Logo区域 -->
    <view class="logo-section flex flex-col items-center justify-center py-12">
      <image
        src="/static/logo.svg"
        class="mb-4 h-120rpx w-120rpx"
        mode="aspectFit"
      />
      <text class="text-24px text-gray-800 font-bold">AI表情包</text>
    </view>

    <!-- 登录方式切换 -->
    <view class="login-type-tabs flex items-center justify-center gap-4 px-4 py-4">
      <view
        class="tab-item rounded-20px px-6 py-2 text-16px"
        :class="{
          'bg-primary text-white': loginType === 'wechat',
          'bg-gray-100 text-gray-600': loginType !== 'wechat',
        }"
        @click="handleLoginTypeChange('wechat')"
      >
        微信登录
      </view>
      <view
        class="tab-item rounded-20px px-6 py-2 text-16px"
        :class="{
          'bg-primary text-white': loginType === 'phone',
          'bg-gray-100 text-gray-600': loginType !== 'phone',
        }"
        @click="handleLoginTypeChange('phone')"
      >
        手机号登录
      </view>
    </view>

    <!-- 微信登录 -->
    <view
      v-if="loginType === 'wechat'"
      class="login-form px-4 py-6"
    >
      <wd-button
        type="primary"
        :loading="isLogging"
        :disabled="isLogging"
        block
        @click="handleWeChatLogin"
      >
        <view class="flex items-center gap-2">
          <view class="i-carbon-logo-wechat text-20px" />
          <text>微信快捷登录</text>
        </view>
      </wd-button>
    </view>

    <!-- 手机号登录 -->
    <view
      v-else
      class="login-form px-4 py-6"
    >
      <view class="mb-4">
        <wd-input
          v-model="phoneForm.phone"
          type="number"
          placeholder="请输入手机号"
          maxlength="11"
        />
      </view>

      <view class="mb-6">
        <view class="flex items-center gap-2">
          <wd-input
            v-model="phoneForm.code"
            type="number"
            placeholder="请输入验证码"
            maxlength="6"
            class="flex-1"
          />
          <wd-button
            :disabled="countdown > 0 || isSendingCode"
            :loading="isSendingCode"
            size="small"
            @click="handleSendCode"
          >
            {{ countdown > 0 ? `${countdown}秒` : '发送验证码' }}
          </wd-button>
        </view>
      </view>

      <wd-button
        type="primary"
        :loading="isLogging"
        :disabled="isLogging"
        block
        @click="handlePhoneLogin"
      >
        登录
      </wd-button>
    </view>

    <!-- 用户协议 -->
    <view class="agreement-section px-4 py-4 text-center">
      <text class="text-12px text-gray-500">
        登录即表示同意
        <text class="text-primary">《用户协议》</text>
        和
        <text class="text-primary">《隐私政策》</text>
      </text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.login-page {
  .tab-item {
    transition: all 0.2s;

    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
