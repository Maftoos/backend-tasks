import express, { Request, Response } from 'express';
import multer from 'multer';
import { convertJpegToPngWithSize, getImageDimensions } from './imageConverter';
const sharp = require('sharp')
const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.post('/convertImage', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const outputPath = './image.png'; // Set the output path here
    const dimensions = await getImageDimensions(req);
    const width = dimensions.width;
    const height = dimensions.height;
    await convertJpegToPngWithSize(req.file.buffer, outputPath, width, height);

    res.status(200).send({
      width: width,
      height: height
    });
  } catch (error) {
    console.error('Error during image conversion:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
