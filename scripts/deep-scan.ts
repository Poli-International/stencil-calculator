import fs from 'fs';
import path from 'path';

function getFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        getFiles(fullPath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const files = getFiles('./src').filter(f => !f.endsWith('translations.ts'));

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  console.log(`\n=== Scanning ${file} (${lines.length} lines) ===`);
  
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('import ') || trimmed.startsWith('/*')) return;
    
    // Check for hardcoded JSX text (outside of {t(...)})
    // Match JSX text between tags
    const tagMatch = line.match(/>([^<>{}\r\n]+)</g);
    if (tagMatch) {
      tagMatch.forEach(m => {
        const text = m.slice(1, -1).trim();
        // Ignore single chars, numbers, symbols, css units
        if (text && /[a-zA-Z]{2,}/.test(text) && !text.includes('className') && !text.includes('style') && text !== 'cm' && text !== 'in' && text !== 'mm' && text !== 'px') {
          console.log(`Line ${lineNum} [JSX_TEXT]: "${text}"`);
        }
      });
    }

    // Check for raw string literals passed to functions like alert, toast, etc.
    const toastMatch = line.match(/showToast\((['"`][^'"`]+['"`])/);
    if (toastMatch) {
      if (!toastMatch[1].startsWith("t(")) {
        console.log(`Line ${lineNum} [TOAST_RAW]: ${toastMatch[1]}`);
      }
    }

    // Check for template literals with english words
    const templateLit = line.match(/`([^`]*[a-zA-Z]{3,}[^`]*)`/);
    if (templateLit && !templateLit[1].includes('${') && !templateLit[1].includes('px') && !templateLit[1].includes('rotate')) {
      // check if it's user visible text
      if (!templateLit[1].startsWith('M') && !templateLit[1].startsWith('http') && !templateLit[1].includes('rgb')) {
        console.log(`Line ${lineNum} [TEMPLATE_LIT]: \`${templateLit[1]}\``);
      }
    }
  });
}
