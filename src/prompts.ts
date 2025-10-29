import { ReviewStyle } from "./types.js"

const SYSTEM_BASE = `你是一名严格且专业的代码审查专家。请基于提供的代码/变更，按照规定的评分标准进行审查与打分。评分采用 100 分制，并且必须按照固定格式输出最终总分，格式为：\n\n总分:XX分\n\n分值构成：\n- 功能: 0-40\n- 安全: 0-30\n- 最佳实践: 0-20\n- 性能: 0-5\n- 提交信息: 0-5\n\n请在给出改进建议时具体、可执行。`

const STYLE_HINTS: Record<ReviewStyle, string> = {
  professional: "语气专业、客观、直接，提供清晰的理由与改进建议。",
  sarcastic: "保持轻微讽刺但不失礼节，指出问题时带有幽默与反讽。",
  gentle: "语气温和、建设性，先肯定优点，再指出问题与建议。",
  humorous: "保持幽默风格，用轻松的表达指出问题并给出建议。",
}

function buildUserPrompt({
  contentLabel,
  content,
  commitMessage,
}: {
  contentLabel: string
  content: string
  commitMessage?: string
}): string {
  const commitPart = commitMessage ? `\n\n提交信息（可参考但不作为唯一依据）：\n${commitMessage}` : ""
  return `审查目标：${contentLabel}${commitPart}\n\n审查维度与要求：\n1) 功能（0-40）：实现正确性、边界条件、错误处理、可维护性\n2) 安全（0-30）：输入校验、注入风险、敏感信息、权限控制\n3) 最佳实践（0-20）：命名、结构、抽象、可读性、测试性\n4) 性能（0-5）：时间/空间复杂度、热点路径、无谓开销\n5) 提交信息（0-5）：信息清晰、目的明确、覆盖范围恰当\n\n输出格式：\n- 先给出总体评审意见与关键问题\n- 按维度给出打分点说明与改进建议\n- 最后单独一行输出总分，格式严格为：\n总分:XX分\n\n待审内容如下：\n\n${content}`
}

export function getPrompt(style: ReviewStyle) {
  const systemPrompt = `${SYSTEM_BASE}\n\n风格要求：${STYLE_HINTS[style]}`
  return {
    systemPrompt,
    buildForCode: (code: string, commitMessage?: string) =>
      buildUserPrompt({ contentLabel: "代码整体（可能包含多个片段）", content: code, commitMessage }),
    buildForDiff: (diff: string, commitMessage?: string) =>
      buildUserPrompt({ contentLabel: "Git diff 变更", content: diff, commitMessage }),
    buildForFile: (filePath: string, content: string, commitMessage?: string) =>
      buildUserPrompt({ contentLabel: `文件：${filePath}`, content, commitMessage }),
  }
}

export const DEFAULT_STYLE: ReviewStyle = "professional"
