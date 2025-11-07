/**
 * 图片处理工具函数
 * 支持图片预览、下载、压缩等
 */

/**
 * 预览图片
 * @param urls 图片URL列表
 * @param current 当前显示的图片索引
 */
export function previewImage(urls: string[], current: number = 0) {
  uni.previewImage({
    urls,
    current: typeof current === 'number' ? urls[current] : current,
    fail: (err) => {
      console.error('预览图片失败', err)
      uni.showToast({
        title: '预览失败',
        icon: 'none',
      })
    },
  })
}

/**
 * 下载图片
 * @param url 图片URL
 * @returns 临时文件路径
 */
export function downloadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        }
        else {
          reject(new Error(`下载失败，状态码：${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

/**
 * 压缩图片
 * @param filePath 图片文件路径
 * @param quality 压缩质量（0-100，默认80）
 * @returns 压缩后的文件路径
 */
export function compressImage(filePath: string, quality: number = 80): Promise<string> {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    // H5平台不支持压缩，直接返回原路径
    resolve(filePath)
    // #endif

    // #ifndef H5
    uni.compressImage({
      src: filePath,
      quality,
      success: (res) => {
        resolve(res.tempFilePath)
      },
      fail: (err) => {
        // 压缩失败时返回原路径
        console.warn('图片压缩失败，使用原图', err)
        resolve(filePath)
      },
    })
    // #endif
  })
}

/**
 * 选择图片
 * @param count 最多可以选择的图片数量
 * @param sizeType 图片尺寸类型：original-原图，compressed-压缩图
 * @param sourceType 图片来源：album-相册，camera-相机
 * @returns 选择的图片文件路径列表
 */
export function chooseImage(
  count: number = 1,
  sizeType: ('original' | 'compressed')[] = ['compressed'],
  sourceType: ('album' | 'camera')[] = ['album', 'camera'],
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count,
      sizeType,
      sourceType,
      success: (res) => {
        resolve(res.tempFilePaths)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

/**
 * 获取图片信息
 * @param src 图片路径
 * @returns 图片信息
 */
export function getImageInfo(src: string): Promise<UniApp.GetImageInfoSuccessData> {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

/**
 * 将网络图片转换为本地路径（下载并返回临时路径）
 * @param url 网络图片URL
 * @returns 本地临时文件路径
 */
export async function urlToLocalPath(url: string): Promise<string> {
  try {
    const localPath = await downloadImage(url)
    return localPath
  }
  catch (error) {
    console.error('图片下载失败', error)
    throw error
  }
}
