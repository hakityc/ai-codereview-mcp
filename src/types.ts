/**
 * Code review style types
 */
export type ReviewStyle = "professional" | "sarcastic" | "gentle" | "humorous"

/**
 * Review result with score and details
 */
export interface ReviewResult {
  review: string
  score: number
  style: ReviewStyle
}

/**
 * Detailed score breakdown by criteria
 */
export interface ScoreBreakdown {
  functionality: number // 功能实现的正确性与健壮性 (40分)
  security: number // 安全性与潜在风险 (30分)
  bestPractices: number // 是否符合最佳实践 (20分)
  performance: number // 性能与资源利用效率 (5分)
  commitQuality: number // Commits信息的清晰性与准确性 (5分)
  total: number // 总分 (100分)
}

/**
 * Prompt template structure
 */
export interface PromptTemplate {
  systemPrompt: string
  userPrompt: string
}

/**
 * Review request parameters
 */
export interface ReviewRequest {
  code: string
  style?: ReviewStyle
  commitMessage?: string
  filePath?: string
}
