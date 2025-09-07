import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './src/db/database.js';
import userRouter from './src/routes/user.routes.js';
import transactionRouter from './src/routes/transaction.routes.js';
import { errorHandler } from './src/middlewares/error.middleware.js';

dotenv.config({
    path: './.env'
});

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v2/users', userRouter);
app.use('/api/v2/transactions', transactionRouter);

app.use(errorHandler);

connectDb()
.then(() => {
    app.listen(process.env.PORT || 5001, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log('MongoDB connection failed !!', err);
})