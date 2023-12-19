import * as path from 'path'
import sharp = require('sharp');
import { Request } from 'express';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function getImageDimensions(req: Request): Promise<{ width: any, height: any }> {
  try {
    if (!req.file) {
      throw new Error('No file provided');
    }

    // Read the image from the buffer and get metadata
    const metadata = await sharp(req.file.buffer).metadata();
    const { width, height } = metadata;

    return { width, height };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    throw error; // Rethrow the error to handle it in the calling code if needed
  }
}

export async function convertJpegToPngWithSize(fileBuffer: Buffer, outputPath: string, width: number | null, height: number | null) {
  try {
    if (!fileBuffer) {
      throw new Error('No file provided');
    }

    // Convert the image to PNG format and resize it to the specified dimensions
    const sharpInstance = sharp(fileBuffer);

    if (width !== null && height !== null) {
      sharpInstance.resize({ width, height });
    }

    // Save the resulting image to the output path
    await sharpInstance.toFile(outputPath);

    console.log('Image conversion completed successfully.');
  } catch (error) {
    console.error('Error converting JPEG to PNG with specific size:', error);
    throw error; // Rethrow the error to handle it in the calling code if needed
  }
}
export function resizeDimensions(width: number, height: number): { newWidth: number, newHeight: number } {
  const aspectRatio = width / height;
  const newWidth = 960;
  const newHeight = Math.round(newWidth / aspectRatio);
  return { newWidth, newHeight };
}

// export async function convertImage(inputPath:string, outputPath:string) {
//   const imagePath = inputPath;
//   const outputImagePath = outputPath;

//   try {
//     // Get the current image dimensions
//     const { width, height } = await getImageDimensions(imagePath);

//     // Resize the image dimensions
//     const { newWidth, newHeight } = resizeDimensions(width, height);

//     // Convert JPEG to PNG with the resized dimensions
//     await convertJpegToPngWithSize(imagePath, outputImagePath, newWidth, newHeight);

//     console.log('Image conversion completed successfully.');
//   } catch (error) {
//     console.error('Error during image conversion:', error);
//   }
// }


