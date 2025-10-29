/**
 * 提取审查文本中的总分，匹配格式：
 *  - "总分:XX分" 或 "总分：XX分"
 */
export function parseReviewScore(reviewText: string): number {
  if (!reviewText) return 0
  const match = reviewText.match(/总分[:：]\s*(\d+)分?/)
  return match ? parseInt(match[1], 10) : 0
}
