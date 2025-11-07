/**
 * 表情包相关API接口
 * 使用mock数据模拟接口响应
 */
import type {
  DeleteMemeParams,
  FavoriteMemeParams,
  GenerateMemeParams,
  GenerateMemeResponse,
  MemeInfo,
  MemeListParams,
  MemeListResponse,
} from './types/meme'
// import { http } from '@/http/http' // 预留，对接真实API时使用

/**
 * 模拟延迟
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Mock数据：表情包列表
 */
const mockMemeList: MemeInfo[] = [
  {
    id: 1,
    imageUrl: 'https://via.placeholder.com/300x300/22C55E/FFFFFF?text=今天好累',
    text: '今天好累',
    style: 'funny',
    createTime: new Date().toISOString(),
    isFavorite: false,
    likeCount: 128,
    favoriteCount: 56,
  },
  {
    id: 2,
    imageUrl: 'https://via.placeholder.com/300x300/10B981/FFFFFF?text=加油打工人',
    text: '加油打工人',
    style: 'cute',
    createTime: new Date(Date.now() - 86400000).toISOString(),
    isFavorite: true,
    likeCount: 256,
    favoriteCount: 89,
  },
  {
    id: 3,
    imageUrl: 'https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=我要下班',
    text: '我要下班',
    style: 'serious',
    createTime: new Date(Date.now() - 172800000).toISOString(),
    isFavorite: false,
    likeCount: 89,
    favoriteCount: 23,
  },
  {
    id: 4,
    imageUrl: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=周末快乐',
    text: '周末快乐',
    style: 'happy',
    createTime: new Date(Date.now() - 259200000).toISOString(),
    isFavorite: true,
    likeCount: 512,
    favoriteCount: 156,
  },
]

/**
 * 文字生成表情包
 * @param params 生成参数
 * @returns 生成结果
 */
export async function generateMemeByText(params: GenerateMemeParams): Promise<GenerateMemeResponse> {
  // 模拟API请求延迟
  await delay(2000)

  // Mock响应数据
  const mockResponse: GenerateMemeResponse = {
    meme: {
      id: Date.now(),
      imageUrl: `https://via.placeholder.com/400x400/22C55E/FFFFFF?text=${encodeURIComponent(params.text)}`,
      text: params.text,
      style: params.style || 'funny',
      createTime: new Date().toISOString(),
      isFavorite: false,
      likeCount: 0,
      favoriteCount: 0,
    },
    duration: 2,
  }

  // 实际项目中，这里应该调用真实API
  // return http.post<GenerateMemeResponse>('/api/meme/generate', params)

  return Promise.resolve(mockResponse)
}

/**
 * 模板生成表情包
 * @param params 生成参数（包含templateId和templateText）
 * @returns 生成结果
 */
export async function generateMemeByTemplate(params: GenerateMemeParams & { templateId: number }): Promise<GenerateMemeResponse> {
  // 模拟API请求延迟
  await delay(2000)

  // Mock响应数据
  const mockResponse: GenerateMemeResponse = {
    meme: {
      id: Date.now(),
      imageUrl: `https://via.placeholder.com/400x400/10B981/FFFFFF?text=${encodeURIComponent(params.templateText || params.text)}`,
      text: params.templateText || params.text,
      style: params.style || 'cute',
      templateId: params.templateId,
      createTime: new Date().toISOString(),
      isFavorite: false,
      likeCount: 0,
      favoriteCount: 0,
    },
    duration: 2,
  }

  // 实际项目中，这里应该调用真实API
  // return http.post<GenerateMemeResponse>('/api/meme/generate-by-template', params)

  return Promise.resolve(mockResponse)
}

/**
 * 获取我的表情包列表
 * @param params 查询参数
 * @returns 表情包列表
 */
export async function getMyMemeList(params: MemeListParams = {}): Promise<MemeListResponse> {
  // 模拟API请求延迟
  await delay(500)

  const { page = 1, pageSize = 20, timeRange = 'all', style, onlyFavorite = false } = params

  // 筛选数据
  let filteredList = [...mockMemeList]

  // 按时间范围筛选
  if (timeRange === '7days') {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    filteredList = filteredList.filter(item => new Date(item.createTime).getTime() > sevenDaysAgo)
  }
  else if (timeRange === '30days') {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    filteredList = filteredList.filter(item => new Date(item.createTime).getTime() > thirtyDaysAgo)
  }

  // 按风格筛选
  if (style) {
    filteredList = filteredList.filter(item => item.style === style)
  }

  // 按收藏筛选
  if (onlyFavorite) {
    filteredList = filteredList.filter(item => item.isFavorite)
  }

  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedList = filteredList.slice(start, end)

  const mockResponse: MemeListResponse = {
    list: paginatedList,
    total: filteredList.length,
    page,
    pageSize,
  }

  // 实际项目中，这里应该调用真实API
  // return http.get<MemeListResponse>('/api/meme/my-list', { params })

  return Promise.resolve(mockResponse)
}

/**
 * 删除表情包
 * @param params 删除参数
 * @returns 删除结果
 */
export async function deleteMeme(params: DeleteMemeParams): Promise<void> {
  // 模拟API请求延迟
  await delay(300)

  // 从mock数据中删除（实际项目中不需要）
  const index = mockMemeList.findIndex(item => item.id === params.id)
  if (index > -1) {
    mockMemeList.splice(index, 1)
  }

  // 实际项目中，这里应该调用真实API
  // return http.delete<void>(`/api/meme/${params.id}`)

  return Promise.resolve()
}

/**
 * 收藏/取消收藏表情包
 * @param params 收藏参数
 * @returns 操作结果
 */
export async function favoriteMeme(params: FavoriteMemeParams): Promise<void> {
  // 模拟API请求延迟
  await delay(300)

  // 更新mock数据（实际项目中不需要）
  const item = mockMemeList.find(item => item.id === params.id)
  if (item) {
    item.isFavorite = params.isFavorite
    if (params.isFavorite) {
      item.favoriteCount = (item.favoriteCount || 0) + 1
    }
    else {
      item.favoriteCount = Math.max((item.favoriteCount || 0) - 1, 0)
    }
  }

  // 实际项目中，这里应该调用真实API
  // return http.post<void>(`/api/meme/${params.id}/favorite`, { isFavorite: params.isFavorite })

  return Promise.resolve()
}

/**
 * 获取相似表情包推荐
 * @param memeId 表情包ID
 * @param limit 推荐数量
 * @returns 相似表情包列表
 */
export async function getSimilarMemes(memeId: number, limit: number = 4): Promise<MemeInfo[]> {
  // 模拟API请求延迟
  await delay(500)

  // Mock响应：返回除当前表情包外的其他表情包
  const similarList = mockMemeList.filter(item => item.id !== memeId).slice(0, limit)

  // 实际项目中，这里应该调用真实API
  // return http.get<MemeInfo[]>(`/api/meme/${memeId}/similar`, { params: { limit } })

  return Promise.resolve(similarList)
}

/**
 * 获取表情包详情
 * @param id 表情包ID
 * @returns 表情包详情
 */
export async function getMemeDetail(id: number): Promise<MemeInfo> {
  // 模拟API请求延迟
  await delay(300)

  // Mock响应
  const meme = mockMemeList.find(item => item.id === id)
  if (!meme) {
    throw new Error('表情包不存在')
  }

  // 实际项目中，这里应该调用真实API
  // return http.get<MemeInfo>(`/api/meme/${id}`)

  return Promise.resolve(meme)
}
