import fs from 'fs/promises';
import path from 'path';

const CONTENT_DIR = 'src/content';
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

async function processMarkdownFile(filePath: string) {
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;

    // Заменяем ссылки в формате heroImage: '/path/image.jpg'
    for (const ext of IMAGE_EXTENSIONS) {
      const heroImageRegex = new RegExp(`(heroImage:\\s*['"].*?)${ext}(['"])`, 'g');
      if (content.match(heroImageRegex)) {
        content = content.replace(heroImageRegex, '$1.webp$2');
        modified = true;
      }
    }

    // Заменяем ссылки в формате ![alt](/path/image.jpg)
    for (const ext of IMAGE_EXTENSIONS) {
      const markdownImageRegex = new RegExp(`(!\\[.*?\\]\\(.*?)${ext}(\\))`, 'g');
      if (content.match(markdownImageRegex)) {
        content = content.replace(markdownImageRegex, '$1.webp$2');
        modified = true;
      }
    }

    if (modified) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`✓ Обновлены ссылки в файле: ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`Ошибка при обработке файла ${filePath}:`, error);
  }
}

async function processDirectory(dirPath: string) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.name.endsWith('.md')) {
      await processMarkdownFile(fullPath);
    }
  }
}

async function updateImageLinks() {
  try {
    await processDirectory(CONTENT_DIR);
    console.log('Обновление ссылок завершено!');
  } catch (error) {
    console.error('Ошибка при обновлении ссылок:', error);
  }
}

updateImageLinks(); 