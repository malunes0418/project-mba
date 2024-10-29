import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import mbaRoutes from './routes/mbaRoutes';
import syncDatabase from './models/index';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());


app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/mba', mbaRoutes);


syncDatabase();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
