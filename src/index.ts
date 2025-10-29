import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { buildReviewCodePrompt } from "./tools/review-code.js"
import { buildReviewDiffPrompt } from "./tools/review-diff.js"
import { buildReviewFilePrompt } from "./tools/review-file.js"
import { parseReviewScoreTool } from "./tools/parse-score.js"
import { DEFAULT_STYLE } from "./prompts.js"

const server = new McpServer({ name: "ai-codereview-mcp", version: "0.1.0" }, { capabilities: { tools: {} } })

server.tool(
  "review_code",
  "构建用于代码整体审查与打分的 LLM 提示词（不直接调用 LLM）",
  {
    code: z.string().describe("待审查的代码文本"),
    style: z.enum(["professional", "sarcastic", "gentle", "humorous"]).optional().describe("审查风格，可选"),
    commitMessage: z.string().optional().describe("可选的提交信息"),
  },
  async (args) => {
    const { code, style = DEFAULT_STYLE, commitMessage } = args
    const result = buildReviewCodePrompt({ code, style, commitMessage })
    return { content: [{ type: "text", text: JSON.stringify(result) }] }
  }
)

server.tool(
  "review_diff",
  "构建用于 Git diff 变更审查与打分的 LLM 提示词（不直接调用 LLM）",
  {
    diff: z.string().describe("git diff 内容"),
    style: z.enum(["professional", "sarcastic", "gentle", "humorous"]).optional().describe("审查风格，可选"),
    commitMessage: z.string().optional().describe("可选的提交信息"),
  },
  async (args) => {
    const { diff, style = DEFAULT_STYLE, commitMessage } = args
    const result = buildReviewDiffPrompt({ diff, style, commitMessage })
    return { content: [{ type: "text", text: JSON.stringify(result) }] }
  }
)

server.tool(
  "review_file",
  "构建用于单文件审查与打分的 LLM 提示词（不直接调用 LLM）",
  {
    filePath: z.string().describe("文件路径"),
    content: z.string().describe("文件内容"),
    style: z.enum(["professional", "sarcastic", "gentle", "humorous"]).optional().describe("审查风格，可选"),
    commitMessage: z.string().optional().describe("可选的提交信息"),
  },
  async (args) => {
    const { filePath, content, style = DEFAULT_STYLE, commitMessage } = args
    const result = buildReviewFilePrompt({ filePath, content, style, commitMessage })
    return { content: [{ type: "text", text: JSON.stringify(result) }] }
  }
)

server.tool(
  "parse_review_score",
  "从审查文本中解析评分（提取 '总分:XX分' 格式）",
  {
    reviewText: z.string().describe("审查文本，应包含 '总分:XX分' 格式的评分"),
  },
  async (args) => {
    const { reviewText } = args
    const result = parseReviewScoreTool(reviewText)
    return { content: [{ type: "text", text: JSON.stringify(result) }] }
  }
)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

// 作为可执行入口
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
