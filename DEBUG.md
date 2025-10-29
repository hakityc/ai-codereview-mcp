# MCP Inspector 调试指南

## 什么是 MCP Inspector？

MCP Inspector 是一个交互式调试工具，可以让你：
- 查看和测试 MCP 服务器的所有工具
- 直接调用工具并查看响应
- 查看服务器状态和日志
- 调试 MCP 服务器的功能

## 使用方法

### 1. 启动开发服务器

```bash
npm run dev
```

这将启动一个 HTTP 服务器，默认运行在 `http://localhost:3000`。

### 2. 启动 MCP Inspector

在另一个终端运行：

```bash
npx @modelcontextprotocol/inspector
```

### 3. 连接到服务器

在 MCP Inspector 中：
- **传输方式**：选择 "Streamable HTTP"
- **URL**：输入 `http://localhost:3000/mcp`
- 点击连接

### 4. 测试工具

连接成功后，你可以：
- 查看所有已注册的工具（`review_code`、`review_diff`、`review_file`、`parse_review_score`）
- 点击工具名称查看参数说明
- 输入参数并调用工具
- 查看工具返回的结果

## 示例

### 测试 `review_code` 工具

1. 在 Inspector 中找到 `review_code` 工具
2. 输入参数：
   ```json
   {
     "code": "function add(a, b) { return a + b; }",
     "style": "professional"
   }
   ```
3. 点击 "Call Tool"
4. 查看返回的 prompt 配置（包含 `systemPrompt` 和 `userPrompt`）

### 测试 `parse_review_score` 工具

1. 找到 `parse_review_score` 工具
2. 输入参数：
   ```json
   {
     "reviewText": "总体评价：代码质量良好。总分:85分"
   }
   ```
3. 查看解析出的评分结果

## 环境变量

可以通过环境变量自定义端口：

```bash
PORT=8080 npm run dev
```

## 注意事项

- 开发服务器仅用于调试，生产环境应使用 `src/index.ts`（Stdio 模式）
- Inspector 需要先启动开发服务器才能连接
- 如果遇到连接问题，检查端口是否被占用

## 更多信息

- [MCP Inspector GitHub](https://github.com/modelcontextprotocol/inspector)
- [MCP 文档](https://modelcontextprotocol.io/docs)

