import express, { Request, Response } from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import Trade from './models/trade.model';
const db = require("./config/dbconnect")
const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT;
db();

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


app.post('/balance', async (req: Request, res: Response) =>{
  try {
    const { timestamp } = req.body;
    if (!timestamp) {
      return res.status(400).json({ error: 'Timestamp is required' });
    }

    const assetBalance = await GET_ASSET_BALANCE_AT_TIMESTAMP(timestamp);
    res.status(200).json(assetBalance);
  } catch (err) {
    res.status(500).json({ error: `Error getting asset balance: ${err}` });
  }

});
const GET_ASSET_BALANCE_AT_TIMESTAMP = async (timestamp:any) => {
  try {
    const trades = await Trade.find({ utcTime: { $lte: new Date(timestamp) } }).sort({ utcTime: 1 });

    const assetBalance:any = {};

    trades.forEach((trade) => {
      const { baseCoin, amount, operation } = trade;
      const balance = assetBalance[baseCoin] || 0;

      if (operation === 'Buy') {
        assetBalance[baseCoin] = balance + amount;
      } else {
        assetBalance[baseCoin] = balance - amount;
      }
    });

    return assetBalance;
  } catch (err) {
    throw new Error(`Error getting asset balance: ${err}`);
  }
};
app.listen(`${PORT}`, () => {
  console.log(`Server is running on port ${PORT}`);
});