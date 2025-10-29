<!-- 989ba61e-28f6-47ab-bbc0-c0d906baf14e b3155478-2f7d-4ef6-8516-11c4b6cab15d -->
# AI CodeReview MCP Server 实现计划

## 项目概述

在 `/Users/lebo/lebo/project/ai-codereview-mcp` 创建独立的 TypeScript MCP server，提供代码审查和评分功能，LLM 由调用方提供。

## 核心功能

- 代码审查（支持 diff 和完整文件）
- 多维度评分系统（功能40分、安全30分、最佳实践20分、性能5分、提交信息5分）
- 4种审查风格（professional/sarcastic/gentle/humorous）
- 评分解析工具

## 实现步骤

### 1. 项目初始化

创建项目目录结构：

```
ai-codereview-mcp/
├── src/
│   ├── index.ts          # MCP server 入口
│   ├── prompts.ts        # Prompt 模板配置
│   ├── parser.ts         # 评分解析逻辑
│   ├── tools/           # MCP 工具实现
│   │   ├── review-code.ts
│   │   ├── review-diff.ts
│   │   ├── review-file.ts
│   │   └── parse-score.ts
│   └── types.ts         # TypeScript 类型定义
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```

### 2. 移植 Prompt 模板

从 `conf/prompt_templates.yml` 移植到 `src/prompts.ts`：

- 将 YAML 格式转为 TypeScript 对象
- 保留 Jinja2 模板逻辑（使用字符串模板替换）
- 实现 `getPrompt(style: ReviewStyle)` 函数
- 评分标准保持一致：总分100分，分5个维度

### 3. 实现评分解析器

在 `src/parser.ts` 中：

```typescript
export function parseReviewScore(reviewText: string): number {
  if (!reviewText) return 0;
  const match = reviewText.match(/总分[:：]\s*(\d+)分?/);
  return match ? parseInt(match[1], 10) : 0;
}
```

### 4. 实现 MCP 工具

#### 工具1：review_code（综合工具）

- 参数：`code: string`, `style?: ReviewStyle`, `commitMessage?: string`
- 功能：构建 prompt，调用 LLM，解析评分
- 返回：`{ review: string, score: number, breakdown?: object }`

#### 工具2：review_diff

- 参数：`diff: string`, `style?: ReviewStyle`, `commitMessage?: string`
- 功能：专门审查 git diff 格式的代码变更
- 返回：与 review_code 相同

#### 工具3：review_file

- 参数：`filePath: string`, `content: string`, `style?: ReviewStyle`
- 功能：审查单个完整文件
- 返回：与 review_code 相同

#### 工具4：parse_review_score

- 参数：`reviewText: string`
- 功能：从已有的审查文本中提取评分
- 返回：`{ score: number }`

### 5. MCP Server 配置

在 `src/index.ts` 中：

- 使用 `@modelcontextprotocol/sdk` 创建 server
- 注册所有工具
- 配置工具的 schema 定义
- 实现工具调用处理逻辑

### 6. 依赖和配置

`package.json` 主要依赖：

- `@modelcontextprotocol/sdk`
- TypeScript 相关包

`tsconfig.json` 配置：

- target: ES2020+
- module: ESNext
- strict mode

### 7. 文档编写

`README.md` 包含：

- 项目介绍和特性
- 安装和配置方法
- MCP 工具使用示例
- 评分标准说明
- 审查风格说明

## 技术要点

1. **Prompt 工程**：复用原项目的评分体系，确保输出格式为 "总分:XX分"
2. **类型安全**：定义清晰的 TypeScript 接口
3. **错误处理**：工具调用失败时返回友好错误信息
4. **可扩展性**：风格配置采用枚举，方便后续扩展

## 优先级说明

- P0（核心）：review_code、review_diff、评分解析、professional 风格
- P1（次要）：其他3种审查风格、review_file、parse_review_score 工具

### To-dos

- [ ] 创建项目目录结构和配置文件（package.json, tsconfig.json）
- [ ] 定义 TypeScript 类型和接口（ReviewStyle, ReviewResult 等）
- [ ] 移植 prompt 模板到 prompts.ts，实现风格切换逻辑
- [ ] 实现评分解析器 parseReviewScore 函数
- [ ] 实现 review_code 工具（核心综合工具）
- [ ] 实现 review_diff 工具（专门处理 diff 格式）
- [ ] 创建 MCP server 入口，注册工具和处理逻辑
- [ ] 实现 review_file 和 parse_review_score 工具
- [ ] 编写 README 和使用文档
- [ ] 测试 MCP server 与 Cursor 的集成