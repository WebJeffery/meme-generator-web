<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '会员中心',
  },
})

// 会员套餐列表
const vipPlans = ref([
  {
    id: 1,
    name: '月度会员',
    price: 9.9,
    originalPrice: 19.9,
    duration: '1个月',
    features: ['无限生成', '高级模板', '批量生成', '去水印'],
    popular: false,
  },
  {
    id: 2,
    name: '季度会员',
    price: 24.9,
    originalPrice: 59.7,
    duration: '3个月',
    features: ['无限生成', '高级模板', '批量生成', '去水印', '优先客服'],
    popular: true,
  },
  {
    id: 3,
    name: '年度会员',
    price: 79.9,
    originalPrice: 238.8,
    duration: '12个月',
    features: ['无限生成', '高级模板', '批量生成', '去水印', '优先客服', '专属标识'],
    popular: false,
  },
])

// 当前会员状态
const currentVipStatus = ref({
  isVip: false,
  expireTime: '',
  level: '普通用户',
})

// 会员特权列表
const vipFeatures = ref([
  { icon: 'i-carbon-checkmark', text: '无限生成表情包', vip: true },
  { icon: 'i-carbon-checkmark', text: '使用高级模板', vip: true },
  { icon: 'i-carbon-checkmark', text: '批量生成功能', vip: true },
  { icon: 'i-carbon-checkmark', text: '去除水印', vip: true },
  { icon: 'i-carbon-checkmark', text: '优先客服支持', vip: true },
  { icon: 'i-carbon-checkmark', text: '专属会员标识', vip: true },
  { icon: 'i-carbon-close', text: '每日限生成5次', vip: false },
  { icon: 'i-carbon-close', text: '仅基础模板', vip: false },
])

// 购买会员
function handlePurchase(plan: typeof vipPlans.value[0]) {
  uni.showModal({
    title: '确认购买',
    content: `确定要购买${plan.name}吗？`,
    success: (res) => {
      if (res.confirm) {
        // 这里应该调用支付接口
        uni.showToast({
          title: '支付功能开发中',
          icon: 'none',
        })
      }
    },
  })
}
</script>

<template>
  <view class="vip-page min-h-screen bg-gray-50">
    <!-- 当前会员状态 -->
    <view class="vip-status from-yellow-400 to-orange-500 bg-gradient-to-r px-4 py-8 text-white">
      <view class="text-center">
        <view class="mb-2 text-32px font-bold">
          {{ currentVipStatus.isVip ? 'VIP会员' : '普通用户' }}
        </view>
        <view
          v-if="currentVipStatus.isVip"
          class="text-14px opacity-90"
        >
          到期时间：{{ currentVipStatus.expireTime || '永久' }}
        </view>
        <view
          v-else
          class="text-14px opacity-90"
        >
          开通会员，享受更多特权
        </view>
      </view>
    </view>

    <!-- 会员特权对比 -->
    <view class="vip-features bg-white px-4 py-6">
      <view class="mb-4 text-18px text-gray-800 font-bold">
        会员特权
      </view>
      <view class="space-y-3">
        <view
          v-for="(feature, index) in vipFeatures"
          :key="index"
          class="flex items-center gap-3"
        >
          <view
            :class="[feature.icon, feature.vip ? 'text-primary' : 'text-gray-400']"
            class="text-20px"
          />
          <text
            :class="feature.vip ? 'text-gray-800' : 'text-gray-400'"
            class="text-14px"
          >
            {{ feature.text }}
          </text>
        </view>
      </view>
    </view>

    <!-- 会员套餐 -->
    <view class="vip-plans px-4 py-6">
      <view class="mb-4 text-18px text-gray-800 font-bold">
        选择套餐
      </view>
      <view class="space-y-4">
        <view
          v-for="plan in vipPlans"
          :key="plan.id"
          class="plan-card relative rounded-12px bg-white p-4 shadow-sm"
          :class="{ 'border-2 border-primary': plan.popular }"
        >
          <!-- 推荐标签 -->
          <view
            v-if="plan.popular"
            class="absolute right-4 rounded-4px bg-primary px-3 py-1 -top-2"
          >
            <text class="text-10px text-white">推荐</text>
          </view>

          <view class="mb-3 flex items-center justify-between">
            <view>
              <view class="text-18px text-gray-800 font-bold">
                {{ plan.name }}
              </view>
              <view class="mt-1 text-12px text-gray-500">
                {{ plan.duration }}
              </view>
            </view>
            <view class="text-right">
              <view class="text-24px text-primary font-bold">
                ¥{{ plan.price }}
              </view>
              <view
                v-if="plan.originalPrice"
                class="text-12px text-gray-400 line-through"
              >
                ¥{{ plan.originalPrice }}
              </view>
            </view>
          </view>

          <view class="mb-4 flex flex-wrap gap-2">
            <view
              v-for="(feature, index) in plan.features"
              :key="index"
              class="rounded-4px bg-gray-100 px-2 py-1 text-12px text-gray-600"
            >
              {{ feature }}
            </view>
          </view>

          <wd-button
            type="primary"
            block
            :plain="!plan.popular"
            @click="handlePurchase(plan)"
          >
            立即购买
          </wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.vip-page {
  padding-bottom: 40rpx;

  .plan-card {
    transition: transform 0.2s;

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
