import fs from 'fs';
import path from 'path';

const files = [
  'src/components/Anatomical3DVisual.tsx',
  'src/components/Breadcrumb.tsx',
  'src/components/CurvatureCalculatorTab.tsx',
  'src/components/EmailNewsletterSection.tsx',
  'src/components/FaqSection.tsx',
  'src/components/FeedbackSection.tsx',
  'src/components/Footer.tsx',
  'src/components/Header.tsx',
  'src/components/LineworkConverterTab.tsx',
  'src/components/ModalsContainer.tsx',
  'src/components/PlacementGuideTab.tsx',
  'src/components/TabNavigation.tsx',
  'src/components/TemplatesTab.tsx',
  'src/context/AppContext.tsx',
  'src/utils/calculations.ts',
  'src/utils/pdfGenerator.ts'
];

interface FoundString {
  file: string;
  line: number;
  rawLine: string;
  suggestedKey?: string;
  text: string;
}

const results: FoundString[] = [];

// Detailed line-by-line inspection
for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((l, idx) => {
    const lineNum = idx + 1;
    const trimmed = l.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('import ')) {
      return;
    }

    // 1. Check fallback in t('...', '...') or t(...) || '...'
    const tFallback = l.match(/t\(['"][a-zA-Z0-9_]+['"]\)\s*\|\|\s*(['"`][^'"`]+['"`])/);
    if (tFallback) {
      results.push({
        file,
        line: lineNum,
        rawLine: l,
        text: tFallback[1].slice(1, -1)
      });
    }

    // 2. Check hardcoded toast messages like showToast('...', ...)
    const toastMatch = l.match(/showToast\(\s*(['"`][^'"`]+['"`])/);
    if (toastMatch && !toastMatch[1].includes('t(')) {
      results.push({
        file,
        line: lineNum,
        rawLine: l,
        text: toastMatch[1].slice(1, -1)
      });
    }

    // 3. Check JSX text: >Some English Text<
    const jsxTexts = l.matchAll(/>([^<>{}\r\n]+)</g);
    for (const m of jsxTexts) {
      const txt = m[1].trim();
      // filter non-words, math symbols, single chars, pure numbers
      if (txt && /[a-zA-Z]{2,}/.test(txt)) {
        if (!txt.includes('className') && !txt.includes('style') && txt !== 'cm' && txt !== 'inches' && txt !== 'mm' && txt !== 'px' && txt !== 'min' && txt !== 'max') {
          results.push({
            file,
            line: lineNum,
            rawLine: l,
            text: txt
          });
        }
      }
    }
  });
}

console.log(`Found ${results.length} instances`);
console.log(JSON.stringify(results, null, 2));
