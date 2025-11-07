/**
 * 表情包相关类型定义
 */

/**
 * 表情包风格类型
 */
export type MemeStyle = 'funny' | 'cute' | 'serious' | 'adorable' | 'angry' | 'sad' | 'happy'

/**
 * 表情包风格配置
 */
export interface MemeStyleConfig {
  /** 风格标识 */
  value: MemeStyle
  /** 风格名称 */
  label: string
  /** 风格图标 */
  icon?: string
}

/**
 * 表情包生成请求参数
 */
export interface GenerateMemeParams {
  /** 文字内容 */
  text: string
  /** 风格类型 */
  style?: MemeStyle
  /** 模板ID（可选，如果使用模板生成） */
  templateId?: number
  /** 模板文字（可选，用于替换模板中的文字） */
  templateText?: string
}

/**
 * 表情包信息
 */
export interface MemeInfo {
  /** 表情包ID */
  id: number
  /** 表情包图片URL */
  imageUrl: string
  /** 文字内容 */
  text: string
  /** 风格类型 */
  style: MemeStyle
  /** 模板ID（如果使用模板生成） */
  templateId?: number
  /** 创建时间 */
  createTime: string
  /** 是否收藏 */
  isFavorite?: boolean
  /** 点赞数 */
  likeCount?: number
  /** 收藏数 */
  favoriteCount?: number
}

/**
 * 表情包生成响应
 */
export interface GenerateMemeResponse {
  /** 表情包信息 */
  meme: MemeInfo
  /** 生成耗时（秒） */
  duration: number
}

/**
 * 表情包列表请求参数
 */
export interface MemeListParams {
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
  /** 筛选条件：时间范围（7天、30天、全部） */
  timeRange?: '7days' | '30days' | 'all'
  /** 筛选条件：风格 */
  style?: MemeStyle
  /** 是否只显示收藏的 */
  onlyFavorite?: boolean
}

/**
 * 表情包列表响应
 */
export interface MemeListResponse {
  /** 表情包列表 */
  list: MemeInfo[]
  /** 总数 */
  total: number
  /** 当前页 */
  page: number
  /** 每页数量 */
  pageSize: number
}

/**
 * 删除表情包请求参数
 */
export interface DeleteMemeParams {
  /** 表情包ID */
  id: number
}

/**
 * 收藏/取消收藏请求参数
 */
export interface FavoriteMemeParams {
  /** 表情包ID */
  id: number
  /** 是否收藏 */
  isFavorite: boolean
}
