#!/usr/bin/env node
/**
 * 构建后处理脚本：为可执行文件添加 shebang
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const indexPath = join(__dirname, '..', 'dist', 'index.js');

try {
  const content = readFileSync(indexPath, 'utf-8');
  
  // 如果没有 shebang，添加它
  if (!content.startsWith('#!/usr/bin/env node')) {
    const newContent = '#!/usr/bin/env node\n' + content;
    writeFileSync(indexPath, newContent, 'utf-8');
    console.log('✓ Added shebang to dist/index.js');
  } else {
    console.log('✓ dist/index.js already has shebang');
  }
} catch (error) {
  console.error('Error processing index.js:', error);
  process.exit(1);
}

