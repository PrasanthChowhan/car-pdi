/**
 * Memory-safe image utilities.
 * Uses createImageBitmap to offload decoding to a background thread, preventing UI thread jank.
 * Resizes the image to a standard maximum dimension (e.g. 1080px) and compresses it to JPEG.
 */
export async function compressAndResizeImage(file: File | Blob, maxWidth: number = 1080): Promise<Blob> {
  // 1. Create ImageBitmap with browser-native decoding and resizing
  // This is highly memory-safe on mobile and doesn't run blocking work on the main thread.
  const imageBitmap = await createImageBitmap(file);
  
  let width = imageBitmap.width;
  let height = imageBitmap.height;

  // Calculate new dimensions preserving aspect ratio
  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  // Re-create bitmap with specific dimensions to enforce scale-down
  const resizedBitmap = await createImageBitmap(file, {
    resizeWidth: width,
    resizeHeight: height,
    resizeQuality: 'high',
  });

  // 2. Draw the bitmap to canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    resizedBitmap.close();
    imageBitmap.close();
    throw new Error('Could not get 2D canvas context');
  }

  ctx.drawImage(resizedBitmap, 0, 0);

  // Clean up bitmaps immediately to free memory
  resizedBitmap.close();
  imageBitmap.close();

  // 3. Export canvas as compressed JPEG Blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas export to blob failed'));
        }
      },
      'image/jpeg',
      0.8 // 80% compression quality
    );
  });
}

/**
 * Helper to generate a unique UUID
 */
export function generateUUID(): string {
  return 'img_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}
