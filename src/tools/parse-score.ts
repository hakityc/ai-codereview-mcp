import { parseReviewScore } from "../parser.js"

export function parseReviewScoreTool(reviewText: string) {
  const score = parseReviewScore(reviewText)
  return {
    score,
    success: score > 0,
    message: score > 0 ? "成功提取评分" : "未能从文本中提取到有效评分，请确保审查文本包含 '总分:XX分' 格式",
  }
}
