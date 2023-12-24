import * as path from 'path'
import sharp = require('sharp');
import { Request as File } from 'express';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function getImageDimensionsFile(File: Express.Multer.File): Promise<{ width: any, height: any }> {
  try {
    if (!File) {
      throw new Error('No file provided');
    }

    // Read the image from the buffer and get metadata
    const metadata = await sharp(File.buffer).metadata();
    const { width, height } = metadata;

    return { width, height };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    throw error; // Rethrow the error to handle it in the calling code if needed
  }
}
export async function getImageDimensionsPath(imagePath: any): Promise<{ width: any, height: any }> {
  const metadata = await sharp(imagePath).metadata();
  const { width, height } = metadata;
  return { width, height };
}

export async function convertJpegToPngFile(File: Express.Multer.File, outputPath: string, width: number | null, height: number | null) {
  try {
    if (!File) {
      throw new Error('No file provided');
    }

    // Convert the image to PNG format and resize it to the specified dimensions
    const sharpInstance = sharp(File.buffer);

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

export async function convertJpegToPngPath (imagePath:any, outputPath:string, width:number, height:number) {
  try {
    // Read the input JPEG image
    const imageBuffer = await sharp(imagePath)
    // Convert the image to PNG format and resize it to the specified dimensions
    if (width !== null && height !== null) {
      imageBuffer.resize({width, height})
    }
    imageBuffer.toFile(outputPath)
  } catch (error) {
    console.error('Error converting JPEG to PNG with specific size:', error)
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


