# AI Code Review MCP Server

一个基于 Model Context Protocol (MCP) 的代码审查工具服务器，提供多维度的代码审查和打分功能。

## 功能特性

- 🔍 **代码整体审查** - 审查完整代码并生成提示词
- 📝 **Git Diff 审查** - 审查代码变更差异
- 📄 **单文件审查** - 针对特定文件的审查
- 🎯 **智能评分解析** - 从审查文本中提取结构化评分
- 🎨 **多种审查风格** - 支持专业、讽刺、温和、幽默四种风格

## 工具列表

### `review_code`
构建用于代码整体审查与打分的 LLM 提示词

**参数：**
- `code` (string, 必需): 待审查的代码文本
- `style` (enum, 可选): 审查风格 - `professional` | `sarcastic` | `gentle` | `humorous`
- `commitMessage` (string, 可选): 提交信息

### `review_diff`
构建用于 Git diff 变更审查与打分的 LLM 提示词

**参数：**
- `diff` (string, 必需): git diff 内容
- `style` (enum, 可选): 审查风格
- `commitMessage` (string, 可选): 提交信息

### `review_file`
构建用于单文件审查与打分的 LLM 提示词

**参数：**
- `filePath` (string, 必需): 文件路径
- `content` (string, 必需): 文件内容
- `style` (enum, 可选): 审查风格
- `commitMessage` (string, 可选): 提交信息

### `parse_review_score`
从审查文本中解析评分（提取 '总分:XX分' 格式）

**参数：**
- `reviewText` (string, 必需): 审查文本，应包含 '总分:XX分' 格式的评分

## 安装

### 方式一：全局安装

```bash
npm install -g ai-codereview-mcp
```

### 方式二：本地安装

```bash
npm install ai-codereview-mcp
```

### 方式三：从源码安装

```bash
git clone <repository-url>
cd ai-codereview-mcp
npm install
npm run build
```

## 使用方法

### 在 Claude Desktop 中使用

1. 找到 Claude Desktop 的配置文件位置：
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. 编辑配置文件，添加 MCP 服务器配置：

```json
{
  "mcpServers": {
    "ai-codereview": {
      "command": "npx",
      "args": [
        "-y",
        "ai-codereview-mcp"
      ]
    }
  }
}
```

或者如果已全局安装：

```json
{
  "mcpServers": {
    "ai-codereview": {
      "command": "ai-codereview-mcp"
    }
  }
}
```

如果从本地路径安装：

```json
{
  "mcpServers": {
    "ai-codereview": {
      "command": "node",
      "args": [
        "/path/to/ai-codereview-mcp/dist/index.js"
      ]
    }
  }
}
```

3. 重启 Claude Desktop

### 使用 MCP Inspector 调试

1. 启动开发服务器：
```bash
npm run dev
```

2. 在另一个终端启动 Inspector：
```bash
npx @modelcontextprotocol/inspector
```

3. 在浏览器中：
   - 选择传输方式：**Streamable HTTP**
   - URL：`http://localhost:3000/mcp`
   - 连接

详细说明请查看 [DEBUG.md](./DEBUG.md)

## 环境变量

可以通过 `.env` 文件配置环境变量：

```bash
PORT=3000
```

或者在启动时设置：

```bash
PORT=8080 npm run dev
```

## 开发

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 开发模式（支持 Inspector）
npm run dev

# 监听模式构建
npm run watch
```

## 项目结构

```
ai-codereview-mcp/
├── src/
│   ├── index.ts           # 主入口（Stdio 模式，用于生产）
│   ├── dev-server.ts      # 开发服务器（HTTP 模式，用于调试）
│   ├── prompts.ts         # 提示词生成逻辑
│   ├── parser.ts          # 评分解析逻辑
│   ├── types.ts           # TypeScript 类型定义
│   └── tools/             # MCP 工具实现
│       ├── review-code.ts
│       ├── review-diff.ts
│       ├── review-file.ts
│       └── parse-score.ts
├── dist/                  # 编译输出
├── scripts/
│   └── post-build.js     # 构建后处理脚本
├── package.json
└── README.md
```

## 许可证

MIT

## 相关链接

- [Model Context Protocol 文档](https://modelcontextprotocol.io/docs)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)

