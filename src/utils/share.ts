/**
 * 分享工具函数
 * 支持微信分享、保存到相册等
 */

/**
 * 分享到微信
 * @param imageUrl 图片URL
 * @param title 分享标题
 */
export async function shareToWeChat(imageUrl: string, title: string = 'AI表情包') {
  return new Promise<void>((resolve, reject) => {
    // #ifdef MP-WEIXIN
    // 微信小程序分享
    uni.shareAppMessage({
      title,
      imageUrl,
      success: () => {
        uni.showToast({
          title: '分享成功',
          icon: 'success',
        })
        resolve()
      },
      fail: (err) => {
        uni.showToast({
          title: '分享失败',
          icon: 'none',
        })
        reject(err)
      },
    })
    // #endif

    // #ifndef MP-WEIXIN
    // 其他平台提示
    uni.showToast({
      title: '请使用微信分享功能',
      icon: 'none',
    })
    reject(new Error('不支持微信分享'))
    // #endif
  })
}

/**
 * 分享到钉钉
 * @param imageUrl 图片URL
 * @param title 分享标题
 */
export async function shareToDingTalk(imageUrl: string, title: string = 'AI表情包') {
  return new Promise<void>((resolve, reject) => {
    // #ifdef MP-ALIPAY
    // 钉钉/支付宝小程序分享
    my.share({
      title,
      imageUrl,
      success: () => {
        uni.showToast({
          title: '分享成功',
          icon: 'success',
        })
        resolve()
      },
      fail: (err) => {
        uni.showToast({
          title: '分享失败',
          icon: 'none',
        })
        reject(err)
      },
    })
    // #endif

    // #ifndef MP-ALIPAY
    uni.showToast({
      title: '请使用钉钉分享功能',
      icon: 'none',
    })
    reject(new Error('不支持钉钉分享'))
    // #endif
  })
}

/**
 * 保存图片到相册
 * @param imageUrl 图片URL
 */
export async function saveImageToAlbum(imageUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 先下载图片
    uni.downloadFile({
      url: imageUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          // 保存到相册
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              uni.showToast({
                title: '保存成功',
                icon: 'success',
              })
              resolve()
            },
            fail: (err) => {
              // 可能是用户拒绝了权限
              if (err.errMsg.includes('auth deny')) {
                uni.showModal({
                  title: '提示',
                  content: '需要您授权保存相册权限',
                  showCancel: false,
                })
              }
              else {
                uni.showToast({
                  title: '保存失败',
                  icon: 'none',
                })
              }
              reject(err)
            },
          })
        }
        else {
          uni.showToast({
            title: '下载失败',
            icon: 'none',
          })
          reject(new Error('下载失败'))
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '下载失败',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}

/**
 * 显示分享选择菜单
 * @param imageUrl 图片URL
 * @param title 分享标题
 */
export function showShareMenu(imageUrl: string, title: string = 'AI表情包') {
  const itemList: string[] = []
  const actions: (() => Promise<void>)[] = []

  // #ifdef MP-WEIXIN
  itemList.push('分享到微信')
  actions.push(() => shareToWeChat(imageUrl, title))
  // #endif

  // #ifdef MP-ALIPAY
  itemList.push('分享到钉钉')
  actions.push(() => shareToDingTalk(imageUrl, title))
  // #endif

  itemList.push('保存到相册')
  actions.push(() => saveImageToAlbum(imageUrl))

  if (itemList.length === 0) {
    // 如果没有分享选项，直接保存到相册
    return saveImageToAlbum(imageUrl)
  }

  uni.showActionSheet({
    itemList,
    success: (res) => {
      const action = actions[res.tapIndex]
      if (action) {
        action().catch(() => {
          // 错误已在各自函数中处理
        })
      }
    },
  })
}
