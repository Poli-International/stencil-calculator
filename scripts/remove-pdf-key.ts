import fs from 'fs';
import { translations } from '../src/data/translations';

const langs = ['en', 'fr', 'it', 'de', 'es', 'pt', 'nl'] as const;

let fileOutput = `// Poli International — Multi-Language Dictionaries (v2.6.0)\n`;
fileOutput += `// Cleaned and synchronized translation dictionary\n\n`;
fileOutput += `export const translations: Record<string, Record<string, string>> = {\n`;

for (const lang of langs) {
  fileOutput += `  ${lang}: {\n`;
  const dict = { ...translations[lang] };
  delete dict['pdfSavedSuccess'];
  const sortedKeys = Object.keys(dict).sort();
  for (const k of sortedKeys) {
    const val = dict[k];
    fileOutput += `    ${JSON.stringify(k)}: ${JSON.stringify(val)},\n`;
  }
  fileOutput += `  },\n`;
}

fileOutput += `};\n`;

fs.writeFileSync('./src/data/translations.ts', fileOutput, 'utf-8');
console.log('Removed pdfSavedSuccess.');
