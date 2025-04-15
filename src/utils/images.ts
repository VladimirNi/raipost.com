import sharp from 'sharp';

export async function optimizeImage(inputBuffer: Buffer, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}) {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  let pipeline = sharp(inputBuffer);
  
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }
  
  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality });
      break;
    case 'png':
      pipeline = pipeline.png({ quality });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
  }
  
  return await pipeline.toBuffer();
} 