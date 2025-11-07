/**
 * 模板相关API接口
 * 使用mock数据模拟接口响应
 */
import type {
  TemplateCategory,
  TemplateDetailParams,
  TemplateInfo,
  TemplateListParams,
  TemplateListResponse,
} from './types/template'
// import { http } from '@/http/http' // 预留，对接真实API时使用

/**
 * 模拟延迟
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Mock数据：模板列表
 */
const mockTemplateList: TemplateInfo[] = [
  {
    id: 1,
    name: '工作累',
    description: '表达工作疲惫的经典模板',
    thumbnailUrl: 'https://via.placeholder.com/200x200/22C55E/FFFFFF?text=工作累',
    imageUrl: 'https://via.placeholder.com/400x400/22C55E/FFFFFF?text=工作累',
    category: 'work',
    style: ['funny', 'serious'],
    defaultText: '今天好累',
    useCount: 1234,
    favoriteCount: 567,
    createTime: new Date().toISOString(),
    isHot: true,
  },
  {
    id: 2,
    name: '加油打工人',
    description: '鼓励打工人继续努力的模板',
    thumbnailUrl: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=加油打工人',
    imageUrl: 'https://via.placeholder.com/400x400/10B981/FFFFFF?text=加油打工人',
    category: 'work',
    style: ['cute', 'happy'],
    defaultText: '加油打工人',
    useCount: 2345,
    favoriteCount: 890,
    createTime: new Date(Date.now() - 86400000).toISOString(),
    isHot: true,
  },
  {
    id: 3,
    name: '我要下班',
    description: '表达下班心情的模板',
    thumbnailUrl: 'https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=我要下班',
    imageUrl: 'https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=我要下班',
    category: 'work',
    style: ['funny', 'serious'],
    defaultText: '我要下班',
    useCount: 3456,
    favoriteCount: 1234,
    createTime: new Date(Date.now() - 172800000).toISOString(),
    isHot: true,
  },
  {
    id: 4,
    name: '周末快乐',
    description: '庆祝周末的模板',
    thumbnailUrl: 'https://via.placeholder.com/200x200/8B5CF6/FFFFFF?text=周末快乐',
    imageUrl: 'https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=周末快乐',
    category: 'life',
    style: ['happy', 'cute'],
    defaultText: '周末快乐',
    useCount: 4567,
    favoriteCount: 2345,
    createTime: new Date(Date.now() - 259200000).toISOString(),
    isHot: true,
  },
  {
    id: 5,
    name: '心情不好',
    description: '表达低落情绪的模板',
    thumbnailUrl: 'https://via.placeholder.com/200x200/EF4444/FFFFFF?text=心情不好',
    imageUrl: 'https://via.placeholder.com/400x400/EF4444/FFFFFF?text=心情不好',
    category: 'emotion',
    style: ['sad', 'serious'],
    defaultText: '心情不好',
    useCount: 1234,
    favoriteCount: 567,
    createTime: new Date(Date.now() - 345600000).toISOString(),
    isHot: false,
  },
  {
    id: 6,
    name: '新年快乐',
    description: '新年祝福模板',
    thumbnailUrl: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=新年快乐',
    imageUrl: 'https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=新年快乐',
    category: 'holiday',
    style: ['happy', 'cute'],
    defaultText: '新年快乐',
    useCount: 5678,
    favoriteCount: 3456,
    createTime: new Date(Date.now() - 432000000).toISOString(),
    isHot: true,
  },
  {
    id: 7,
    name: '生日快乐',
    description: '生日祝福模板',
    thumbnailUrl: 'https://via.placeholder.com/200x200/EC4899/FFFFFF?text=生日快乐',
    imageUrl: 'https://via.placeholder.com/400x400/EC4899/FFFFFF?text=生日快乐',
    category: 'holiday',
    style: ['happy', 'cute'],
    defaultText: '生日快乐',
    useCount: 2345,
    favoriteCount: 1234,
    createTime: new Date(Date.now() - 518400000).toISOString(),
    isHot: false,
  },
  {
    id: 8,
    name: '今天很开心',
    description: '表达开心情绪的模板',
    thumbnailUrl: 'https://via.placeholder.com/200x200/14B8A6/FFFFFF?text=今天很开心',
    imageUrl: 'https://via.placeholder.com/400x400/14B8A6/FFFFFF?text=今天很开心',
    category: 'emotion',
    style: ['happy', 'cute'],
    defaultText: '今天很开心',
    useCount: 3456,
    favoriteCount: 1789,
    createTime: new Date(Date.now() - 604800000).toISOString(),
    isHot: false,
  },
]

/**
 * 获取模板列表
 * @param params 查询参数
 * @returns 模板列表
 */
export async function getTemplateList(params: TemplateListParams = {}): Promise<TemplateListResponse> {
  // 模拟API请求延迟
  await delay(500)

  const {
    page = 1,
    pageSize = 20,
    category = 'all',
    style,
    sort = 'hot',
    keyword,
  } = params

  // 筛选数据
  let filteredList = [...mockTemplateList]

  // 按分类筛选
  if (category !== 'all') {
    filteredList = filteredList.filter(item => item.category === category)
  }

  // 按风格筛选
  if (style) {
    filteredList = filteredList.filter(item => item.style.includes(style))
  }

  // 按关键词搜索
  if (keyword) {
    filteredList = filteredList.filter(item =>
      item.name.includes(keyword) || item.description?.includes(keyword),
    )
  }

  // 排序
  if (sort === 'hot') {
    filteredList.sort((a, b) => (b.useCount || 0) - (a.useCount || 0))
  }
  else if (sort === 'latest') {
    filteredList.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
  }

  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedList = filteredList.slice(start, end)

  const mockResponse: TemplateListResponse = {
    list: paginatedList,
    total: filteredList.length,
    page,
    pageSize,
  }

  // 实际项目中，这里应该调用真实API
  // return http.get<TemplateListResponse>('/api/template/list', { params })

  return Promise.resolve(mockResponse)
}

/**
 * 获取模板详情
 * @param params 查询参数
 * @returns 模板详情
 */
export async function getTemplateDetail(params: TemplateDetailParams): Promise<TemplateInfo> {
  // 模拟API请求延迟
  await delay(300)

  // Mock响应
  const template = mockTemplateList.find(item => item.id === params.id)
  if (!template) {
    throw new Error('模板不存在')
  }

  // 实际项目中，这里应该调用真实API
  // return http.get<TemplateInfo>(`/api/template/${params.id}`)

  return Promise.resolve(template)
}

/**
 * 获取热门模板（快速模板）
 * @param limit 数量限制
 * @returns 热门模板列表
 */
export async function getHotTemplates(limit: number = 6): Promise<TemplateInfo[]> {
  // 模拟API请求延迟
  await delay(300)

  // Mock响应：返回热门模板
  const hotTemplates = mockTemplateList
    .filter(item => item.isHot)
    .sort((a, b) => (b.useCount || 0) - (a.useCount || 0))
    .slice(0, limit)

  // 实际项目中，这里应该调用真实API
  // return http.get<TemplateInfo[]>('/api/template/hot', { params: { limit } })

  return Promise.resolve(hotTemplates)
}

/**
 * 获取相似模板推荐
 * @param templateId 模板ID
 * @param limit 推荐数量
 * @returns 相似模板列表
 */
export async function getSimilarTemplates(templateId: number, limit: number = 4): Promise<TemplateInfo[]> {
  // 模拟API请求延迟
  await delay(500)

  // 获取当前模板
  const currentTemplate = mockTemplateList.find(item => item.id === templateId)
  if (!currentTemplate) {
    return Promise.resolve([])
  }

  // Mock响应：返回同分类的其他模板
  const similarTemplates = mockTemplateList
    .filter(item => item.id !== templateId && item.category === currentTemplate.category)
    .slice(0, limit)

  // 实际项目中，这里应该调用真实API
  // return http.get<TemplateInfo[]>(`/api/template/${templateId}/similar`, { params: { limit } })

  return Promise.resolve(similarTemplates)
}

/**
 * 获取模板分类列表
 * @returns 分类配置列表
 */
export function getTemplateCategories() {
  return [
    { value: 'all' as TemplateCategory, label: '全部', icon: 'i-carbon-grid' },
    { value: 'work' as TemplateCategory, label: '工作', icon: 'i-carbon-briefcase' },
    { value: 'life' as TemplateCategory, label: '生活', icon: 'i-carbon-home' },
    { value: 'emotion' as TemplateCategory, label: '情绪', icon: 'i-carbon-face-satisfied' },
    { value: 'holiday' as TemplateCategory, label: '节日', icon: 'i-carbon-calendar' },
  ]
}
