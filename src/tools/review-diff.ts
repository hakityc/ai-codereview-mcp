import { DEFAULT_STYLE, getPrompt } from "../prompts.js"
import { ReviewStyle } from "../types.js"

export function buildReviewDiffPrompt({
  diff,
  style = DEFAULT_STYLE,
  commitMessage,
}: {
  diff: string
  style?: ReviewStyle
  commitMessage?: string
}) {
  const prompt = getPrompt(style)
  return {
    style,
    systemPrompt: prompt.systemPrompt,
    userPrompt: prompt.buildForDiff(diff, commitMessage),
    expectedScoreFormat: "总分:XX分",
    scoreRegex: String(/总分[:：]\s*(\d+)分?/),
  }
}
