import fs from 'fs';
import path from 'path';
import { translations } from '../src/data/translations';

function getFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        getFiles(fullPath, fileList);
      }
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = getFiles('./src').concat(['./index.html']);
const codeFiles = allFiles.filter(f => !f.endsWith('translations.ts'));

const allKeys = Object.keys(translations.en);
console.log('Total keys before:', allKeys.length);

// Get body part keys
const bpFile = './src/data/bodyParts.ts';
const bodyPartKeys: string[] = [];
if (fs.existsSync(bpFile)) {
  const bpContent = fs.readFileSync(bpFile, 'utf-8');
  const matches = bpContent.matchAll(/([a-zA-Z0-9_]+):\s*\{/g);
  for (const m of matches) {
    bodyPartKeys.push('bp_' + m[1]);
  }
}

const orphanedKeys: string[] = [];

for (const key of allKeys) {
  let isUsed = false;
  if (bodyPartKeys.includes(key)) {
    isUsed = true;
  } else {
    for (const file of codeFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes(`'${key}'`) || content.includes(`"${key}"`) || content.includes(`\`${key}\``)) {
        isUsed = true;
        break;
      }
    }
  }
  if (!isUsed) {
    orphanedKeys.push(key);
  }
}

console.log('Orphaned keys count:', orphanedKeys.length);
console.log('Orphaned keys list:', JSON.stringify(orphanedKeys, null, 2));
