<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '帮助中心',
  },
})

// 常见问题列表
const faqList = ref([
  {
    id: 1,
    question: '如何生成表情包？',
    answer: '在首页输入文字，选择风格，点击"生成表情包"按钮即可。也可以从模板库选择模板，编辑文字后生成。',
    expanded: false,
  },
  {
    id: 2,
    question: '如何保存表情包？',
    answer: '在生成结果页或表情包详情页，点击"保存"按钮即可保存到相册。',
    expanded: false,
  },
  {
    id: 3,
    question: '如何分享表情包？',
    answer: '点击表情包上的"分享"按钮，选择分享平台（微信、钉钉等）或保存到相册。',
    expanded: false,
  },
  {
    id: 4,
    question: '如何收藏表情包？',
    answer: '在表情包上长按，选择"收藏"即可。也可以在表情包详情页点击收藏按钮。',
    expanded: false,
  },
  {
    id: 5,
    question: '会员有什么特权？',
    answer: '会员可以无限生成表情包、使用高级模板、批量生成、去除水印等。',
    expanded: false,
  },
  {
    id: 6,
    question: '如何联系客服？',
    answer: '可以在设置页面找到客服联系方式，或通过应用内反馈功能联系我们。',
    expanded: false,
  },
])

// 使用教程
const tutorials = ref([
  {
    id: 1,
    title: '快速开始',
    description: '了解如何快速生成第一个表情包',
    icon: 'i-carbon-play',
  },
  {
    id: 2,
    title: '使用模板',
    description: '学习如何使用模板生成表情包',
    icon: 'i-carbon-template',
  },
  {
    id: 3,
    title: '编辑功能',
    description: '了解如何编辑已生成的表情包',
    icon: 'i-carbon-edit',
  },
  {
    id: 4,
    title: '分享技巧',
    description: '学习如何分享表情包到各个平台',
    icon: 'i-carbon-share',
  },
])

// 切换问题展开状态
function toggleFaq(index: number) {
  faqList.value[index].expanded = !faqList.value[index].expanded
}

// 联系客服
function handleContact() {
  uni.showModal({
    title: '联系客服',
    content: '客服微信：meme-service\n客服电话：400-123-4567',
    showCancel: false,
  })
}
</script>

<template>
  <view class="help-page min-h-screen bg-gray-50">
    <!-- 使用教程 -->
    <view class="tutorial-section bg-white px-4 py-6">
      <view class="mb-4 text-18px text-gray-800 font-bold">
        使用教程
      </view>
      <view class="grid grid-cols-2 gap-4">
        <view
          v-for="tutorial in tutorials"
          :key="tutorial.id"
          class="tutorial-item rounded-12px bg-gray-50 p-4"
        >
          <view
            :class="tutorial.icon"
            class="mb-2 text-32px text-primary"
          />
          <view class="mb-1 text-16px text-gray-800 font-medium">
            {{ tutorial.title }}
          </view>
          <view class="text-12px text-gray-500">
            {{ tutorial.description }}
          </view>
        </view>
      </view>
    </view>

    <!-- 常见问题 -->
    <view class="faq-section mt-4 bg-white px-4 py-6">
      <view class="mb-4 text-18px text-gray-800 font-bold">
        常见问题
      </view>
      <view class="space-y-2">
        <view
          v-for="(faq, index) in faqList"
          :key="faq.id"
          class="faq-item rounded-12px bg-gray-50 p-4"
        >
          <view
            class="faq-question flex items-center justify-between"
            @click="toggleFaq(index)"
          >
            <text class="text-16px text-gray-800 font-medium">{{ faq.question }}</text>
            <view
              :class="faq.expanded ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down'"
              class="text-20px text-gray-400"
            />
          </view>
          <view
            v-if="faq.expanded"
            class="faq-answer mt-3 text-14px text-gray-600"
          >
            {{ faq.answer }}
          </view>
        </view>
      </view>
    </view>

    <!-- 联系客服 -->
    <view class="contact-section mt-4 bg-white px-4 py-6">
      <wd-button
        type="primary"
        block
        @click="handleContact"
      >
        <view class="flex items-center gap-2">
          <view class="i-carbon-chat text-20px" />
          <text>联系客服</text>
        </view>
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.help-page {
  padding-bottom: 40rpx;

  .tutorial-item {
    transition: transform 0.2s;

    &:active {
      transform: scale(0.98);
    }
  }

  .faq-item {
    transition: all 0.2s;

    .faq-question {
      transition: opacity 0.2s;

      &:active {
        opacity: 0.7;
      }
    }
  }
}
</style>
