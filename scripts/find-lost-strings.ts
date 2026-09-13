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

interface LostString {
  file: string;
  line: number;
  text: string;
  type: string;
}

const lostStrings: LostString[] = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((lineStr, lineNumZero) => {
    const lineNum = lineNumZero + 1;
    const trimmed = lineStr.trim();

    // Skip import lines, comments
    if (trimmed.startsWith('import ') || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }

    // 1. Check fallback strings like t(...) || 'fallback string'
    const fallbackMatches = lineStr.matchAll(/t\([^)]+\)\s*\|\|\s*['"`]([^'"`]+)['"`]/g);
    for (const m of fallbackMatches) {
      lostStrings.push({
        file,
        line: lineNum,
        text: m[1],
        type: 'fallback_in_t'
      });
    }

    // 2. Check hardcoded JSX attributes: placeholder="...", title="...", aria-label="...", alt="..."
    const attrMatches = lineStr.matchAll(/(placeholder|title|aria-label|alt)=["']([^"'{}>]+)["']/g);
    for (const m of attrMatches) {
      // ignore css classes or technical values
      if (m[2] && m[2].trim().length > 1 && !m[2].startsWith('http') && !m[2].startsWith('#')) {
        lostStrings.push({
          file,
          line: lineNum,
          text: m[2].trim(),
          type: `attribute_${m[1]}`
        });
      }
    }

    // 3. Check JSX text nodes: >Text<
    const jsxTextMatches = lineStr.matchAll(/>([^<>{}\n]+)</g);
    for (const m of jsxTextMatches) {
      const txt = m[1].trim();
      // filter out symbols, numbers, punctuation
      if (txt.length > 0 && /[a-zA-Z]{2,}/.test(txt) && !txt.includes('className') && !txt.includes('style')) {
        // filter out pure technical strings or math formulas like "A / B"
        if (txt !== 'cm' && txt !== 'in' && txt !== 'mm' && txt !== 'px' && txt !== 'deg') {
          lostStrings.push({
            file,
            line: lineNum,
            text: txt,
            type: 'jsx_text'
          });
        }
      }
    }
  });
}

console.log('Total potential lost strings found:', lostStrings.length);
console.log(JSON.stringify(lostStrings, null, 2));
