import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import Trade from './models/trade.model';

const app = express();
const upload = multer({ dest: 'uploads/' });

mongoose.connect('mongodb+srv://yashhans479:TradeParcing123@cluster0.1sgmptt.mongodb.net/', {
  
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.use(express.json());

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).send('No file uploaded.');
  }

  const trades: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row: any) => {
      const [baseCoin, quoteCoin] = row.Market.split('/');
      trades.push({
        utcTime: new Date(row.UTC_Time),
        operation: row.Operation,
        market: row.Market,
        baseCoin,
        quoteCoin,
        amount: parseFloat(row['Buy/Sell Amount']),
        price: parseFloat(row.Price)
      });
    })
    .on('end', async () => {
      try {
        await Trade.insertMany(trades);
        res.status(201).send('Trades have been uploaded and saved successfully.');
      } catch (error) {
        res.status(500).send('Error saving trades to the database.');
      } finally {
        fs.unlinkSync(filePath);
      }
    })
    .on('error', (error) => {
      res.status(500).send('Error processing CSV file.');
    });
});

app.post('/balance', async (req: Request, res: Response) => {
  const { timestamp } = req.body;
  const date = new Date(timestamp);

  try {
    const trades = await Trade.find({ utcTime: { $lt: date } });

    const balances = trades.reduce((acc: Record<string, number>, trade) => {
      const { baseCoin, operation, amount } = trade;
      if (!acc[baseCoin]) acc[baseCoin] = 0;
      if (operation === 'BUY') {
        acc[baseCoin] += amount;
      } else if (operation === 'SELL') {
        acc[baseCoin] -= amount;
      }
      return acc;
    }, {});

    res.json(balances);
  } catch (error) {
    res.status(500).send('Error fetching balance from the database.');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
