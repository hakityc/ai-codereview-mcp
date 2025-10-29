import { DEFAULT_STYLE, getPrompt } from "../prompts.js"
import { ReviewStyle } from "../types.js"

export function buildReviewFilePrompt({
  filePath,
  content,
  style = DEFAULT_STYLE,
  commitMessage,
}: {
  filePath: string
  content: string
  style?: ReviewStyle
  commitMessage?: string
}) {
  const prompt = getPrompt(style)
  return {
    style,
    systemPrompt: prompt.systemPrompt,
    userPrompt: prompt.buildForFile(filePath, content, commitMessage),
    expectedScoreFormat: "总分:XX分",
    scoreRegex: String(/总分[:：]\s*(\d+)分?/),
  }
}
