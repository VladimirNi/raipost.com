import { optimizeImage } from '../src/utils/images';
import fs from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = 'public';
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];

async function processDirectory(dirPath: string) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        try {
          console.log(`Оптимизация ${entry.name}...`);
          
          const inputBuffer = await fs.readFile(fullPath);
          const optimizedBuffer = await optimizeImage(inputBuffer, {
            quality: 80,
            format: 'webp'
          });
          
          const newFileName = `${path.basename(entry.name, ext)}.webp`;
          const newFilePath = path.join(path.dirname(fullPath), newFileName);
          await fs.writeFile(newFilePath, optimizedBuffer);
          
          console.log(`✓ Создан оптимизированный файл: ${newFileName}`);
        } catch (error) {
          console.error(`Ошибка при оптимизации ${entry.name}:`, error);
        }
      }
    }
  }
}

async function optimizeImages() {
  try {
    await processDirectory(PUBLIC_DIR);
    console.log('Оптимизация завершена!');
  } catch (error) {
    console.error('Ошибка при оптимизации:', error);
  }
}

optimizeImages(); 