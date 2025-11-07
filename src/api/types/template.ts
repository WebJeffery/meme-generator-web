/**
 * 模板相关类型定义
 */

/**
 * 模板分类
 */
export type TemplateCategory = 'all' | 'work' | 'life' | 'emotion' | 'holiday'

/**
 * 模板分类配置
 */
export interface TemplateCategoryConfig {
  /** 分类标识 */
  value: TemplateCategory
  /** 分类名称 */
  label: string
  /** 分类图标 */
  icon?: string
}

/**
 * 模板信息
 */
export interface TemplateInfo {
  /** 模板ID */
  id: number
  /** 模板名称 */
  name: string
  /** 模板描述 */
  description?: string
  /** 模板缩略图URL */
  thumbnailUrl: string
  /** 模板大图URL */
  imageUrl: string
  /** 模板分类 */
  category: TemplateCategory
  /** 模板风格 */
  style: string[]
  /** 模板默认文字 */
  defaultText?: string
  /** 使用次数 */
  useCount?: number
  /** 收藏数 */
  favoriteCount?: number
  /** 创建时间 */
  createTime: string
  /** 是否热门 */
  isHot?: boolean
}

/**
 * 模板列表请求参数
 */
export interface TemplateListParams {
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
  /** 分类筛选 */
  category?: TemplateCategory
  /** 风格筛选 */
  style?: string
  /** 场景筛选 */
  scene?: string
  /** 排序方式：hot-热门，latest-最新 */
  sort?: 'hot' | 'latest'
  /** 搜索关键词 */
  keyword?: string
}

/**
 * 模板列表响应
 */
export interface TemplateListResponse {
  /** 模板列表 */
  list: TemplateInfo[]
  /** 总数 */
  total: number
  /** 当前页 */
  page: number
  /** 每页数量 */
  pageSize: number
}

/**
 * 模板详情请求参数
 */
export interface TemplateDetailParams {
  /** 模板ID */
  id: number
}

/**
 * 相似模板推荐响应
 */
export interface SimilarTemplatesResponse {
  /** 相似模板列表 */
  list: TemplateInfo[]
}
