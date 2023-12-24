import express, { Request, Response } from 'express';
import multer from 'multer';
import { convertJpegToPngFile, getImageDimensionsFile, getImageDimensionsPath, convertJpegToPngPath } from './imageConverter';
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.get('/chart', async (req, res) => {
  const data = req.body;
  if(!data || Object.keys(data).length === 0){
    return res.status(400).send('Invalid data in the request body');
  }

  (async () => {
    const width = 800; //px
  const height = 600; //px
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  const configuration = {
    type: 'bar',
    data: {
      labels: ['low','medium','high','critical'],
      datasets: [{
        backgroundColor: ["green", "yellow","orange","red"],
        data: Object.values(data)
      }]
    },
    options: {
      legend: {
        display: false
     },
    }
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  require('fs').writeFileSync('./chart.png', image);
  })();
  res.status(200).send('Chart created and saved as chart.png');
});

app.post('/convertImage/File', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const outputPath = './image.jpeg'; // Set the output path here
    const dimensions = await getImageDimensionsFile(req.file);
    const width = dimensions.width;
    const height = dimensions.height;
    await convertJpegToPngFile(req.file, outputPath, width, height);

    res.status(200).send({
      width: width,
      height: height
    });
  } catch (error) {
    console.error('Error during image conversion:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/convertImage/Path', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const inputPath = req.query.path
    const outputPath = './imagePath.png'; // Set the output path here
    const dimensions = await getImageDimensionsPath(inputPath);
    const width = dimensions.width;
    const height = dimensions.height;
    await convertJpegToPngPath(inputPath, outputPath, width, height);

    res.status(200).send({
      width: width,
      height: height
    });
  } catch (error) {
    console.error('Error during image conversion:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/ImageDimensions/File', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const dimensions = await getImageDimensionsFile(req.file);
    const width = dimensions.width;
    const height = dimensions.height;

    res.status(200).send({
      width: width,
      height: height
    });
  } catch (error) {
    console.error('Error during image conversion:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/ImageDimensions/Path', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const inputPath = req.query.path
    const dimensions = await getImageDimensionsPath(inputPath);
    const width = dimensions.width;
    const height = dimensions.height;

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
