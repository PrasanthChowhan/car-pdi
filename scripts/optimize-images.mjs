import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to scan for images
const DIRECTORIES = [
  path.join(__dirname, '../public')
];

// Extensions to look for
const TARGET_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

async function processDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);

      if (file.isDirectory()) {
        await processDirectory(fullPath);
      } else {
        const ext = path.extname(file.name).toLowerCase();
        
        const isIcon = file.name.includes('favicon') || 
                       file.name.includes('apple-touch') || 
                       file.name.includes('web-app-manifest');
        
        if (TARGET_EXTENSIONS.includes(ext) && !isIcon) {
          console.log(`Processing: ${file.name}`);
          
          const basePath = fullPath.slice(0, -ext.length);
          const avifPath = `${basePath}.avif`;
          const webpPath = `${basePath}.webp`;

          const image = sharp(fullPath);
          
          // Generate AVIF
          try {
            await fs.access(avifPath);
            console.log(`  - AVIF already exists`);
          } catch {
            await image.avif({ quality: 80, effort: 6 }).toFile(avifPath);
            console.log(`  - Created AVIF`);
          }

          // Generate WebP
          try {
            await fs.access(webpPath);
            console.log(`  - WebP already exists`);
          } catch {
            await image.webp({ quality: 80, effort: 6 }).toFile(webpPath);
            console.log(`  - Created WebP`);
          }
          
          console.log(`  ✓ Done with ${file.name}\n`);
        }
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${dirPath}:`, err);
  }
}

async function main() {
  console.log('Starting Image Optimization...\n');
  for (const dir of DIRECTORIES) {
    console.log(`Scanning ${dir}...`);
    await processDirectory(dir);
  }
  console.log('Image Optimization Complete! 🚀');
}

main();
