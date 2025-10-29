/**
 * 开发模式入口：使用 Streamable HTTP Transport 支持 MCP Inspector 调试
 *
 * 使用方法：
 * 1. 运行：npm run dev
 * 2. 在另一个终端运行：npx @modelcontextprotocol/inspector
 * 3. 在 Inspector 中连接到：http://localhost:3000/mcp
 */

import "dotenv/config"
import { createServer, IncomingMessage, ServerResponse } from "node:http"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { randomUUID } from "node:crypto"
import { z } from "zod"
import { buildReviewCodePrompt } from "./tools/review-code.js"
import { buildReviewDiffPrompt } from "./tools/review-diff.js"
import { buildReviewFilePrompt } from "./tools/review-file.js"
import { parseReviewScoreTool } from "./tools/parse-score.js"
import { DEFAULT_STYLE } from "./prompts.js"

const server = new McpServer({ name: "ai-codereview-mcp", version: "0.1.0" }, { capabilities: { tools: {} } })

// 注册工具
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
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
  const httpServer = createServer()

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  })

  // 连接 transport
  await server.connect(transport)

  // 处理 HTTP 请求
  httpServer.on("request", async (req: IncomingMessage, res: ServerResponse) => {
    // 只处理 /mcp 路径
    if (req.url !== "/mcp") {
      res.writeHead(404, { "Content-Type": "text/plain" })
      res.end("Not Found. Use /mcp endpoint for MCP Inspector.")
      return
    }

    // 解析请求体（如果是 POST）
    let body: unknown = undefined
    if (req.method === "POST") {
      const chunks: Buffer[] = []
      for await (const chunk of req) {
        chunks.push(chunk)
      }
      const rawBody = Buffer.concat(chunks).toString("utf-8")
      try {
        body = JSON.parse(rawBody)
      } catch {
        body = rawBody
      }
    }

    await transport.handleRequest(req as IncomingMessage & { auth?: any }, res, body)
  })

  httpServer.listen(PORT, () => {
    console.log(`🚀 MCP Server 运行在 http://localhost:${PORT}`)
    console.log(`📊 使用 MCP Inspector 连接到: http://localhost:${PORT}/mcp`)
    console.log(`\n运行命令: npx @modelcontextprotocol/inspector`)
  })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
