// src/models/Trade.ts
import mongoose, { Document, Schema } from 'mongoose';

interface ITrade extends Document {
  utcTime: Date;
  operation: string;
  market: string;
  baseCoin: string;
  quoteCoin: string;
  amount: number;
  price: number;
}

const tradeSchema = new Schema<ITrade>({
  utcTime: { type: Date, required: true },
  operation: { type: String, required: true },
  market: { type: String, required: true },
  baseCoin: { type: String, required: true },
  quoteCoin: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true }
});

const Trade = mongoose.model<ITrade>('Trade', tradeSchema);

export default Trade;
