import fs from 'fs';

const content = fs.readFileSync('src/components/CurvatureCalculatorTab.tsx', 'utf-8');
const lines = content.split('\n');

lines.forEach((l, idx) => {
  const lineNum = idx + 1;
  const trimmed = l.trim();
  if (trimmed.startsWith('//') || trimmed.startsWith('import ') || trimmed.startsWith('/*')) return;

  // Look for text in JSX: >text<
  const matches = l.matchAll(/>([^<>{}\r\n]+)</g);
  for (const m of matches) {
    const txt = m[1].trim();
    if (txt && /[a-zA-Z]{3,}/.test(txt) && !txt.includes('className') && !txt.includes('style')) {
      if (txt !== 'Letter' && txt !== 'Spirit' && txt !== 'Standard' && txt !== 'Full') {
        console.log(`Line ${lineNum}: "${txt}" in \`${l.trim()}\``);
      }
    }
  }

  // Look for string literals in JS logic
  const stringLiterals = l.matchAll(/['"]([A-Z][a-zA-Z0-9\s,.:%!-]{4,})['"]/g);
  for (const sm of stringLiterals) {
    const s = sm[1];
    if (!s.startsWith('http') && !s.startsWith('var(') && !s.startsWith('polygon') && !s.includes('calc(')) {
      if (!l.includes('t(') && !l.includes('bodyPart') && !l.includes('format') && !l.includes('category')) {
        console.log(`Line ${lineNum} [STR_LITERAL]: "${s}" in \`${l.trim()}\``);
      }
    }
  }
});
