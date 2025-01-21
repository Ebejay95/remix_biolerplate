import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello Backend!");
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});