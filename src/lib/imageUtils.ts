/**
 * Memory-safe image utilities.
 * Uses createImageBitmap to offload decoding to a background thread, preventing UI thread jank.
 * Resizes the image to a standard maximum dimension (e.g. 1080px) and compresses it to JPEG.
 */
export async function compressAndResizeImage(file: File | Blob, maxWidth: number = 1080): Promise<Blob> {
  let width = 0;
  let height = 0;
  let source: ImageBitmap | HTMLImageElement | null = null;
  let resizedBitmap: ImageBitmap | null = null;

  try {
    // Attempt 1: Modern ImageBitmap decoding
    const imageBitmap = await createImageBitmap(file);
    source = imageBitmap;
    width = imageBitmap.width;
    height = imageBitmap.height;

    // Calculate dimensions
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    try {
      // Attempt resizing via createImageBitmap options
      resizedBitmap = await createImageBitmap(file, {
        resizeWidth: width,
        resizeHeight: height,
        resizeQuality: 'high',
      });
    } catch (e) {
      console.warn('createImageBitmap resizing options not supported, falling back to canvas drawImage scaling', e);
    }
  } catch (e) {
    console.warn('createImageBitmap failed, falling back to HTMLImageElement', e);
    // Attempt 2: Classic HTMLImageElement fallback (highly robust)
    source = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
    width = source.width;
    height = source.height;

    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  }

  // Create canvas and render
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    if (resizedBitmap) resizedBitmap.close();
    if (source && 'close' in source) source.close();
    throw new Error('Could not get 2D canvas context');
  }

  // Draw scaled image
  if (resizedBitmap) {
    ctx.drawImage(resizedBitmap, 0, 0);
  } else if (source) {
    ctx.drawImage(source, 0, 0, width, height);
  }

  // Clean up
  if (resizedBitmap) resizedBitmap.close();
  if (source && 'close' in source) source.close();

  // Export as compressed JPEG
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
