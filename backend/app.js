import express from 'express';
import userRouter from './routes/userRouter.js';
import classroomRouter from './routes/classroomRouter.js';
import workshopRouter from './routes/workshopRouter.js';
import campRouter from './routes/campRouter.js';
import sliderRouter from './routes/sliderRouter.js';
import mailRouter from './routes/mailRouter.js';
import pool from './db.js';
import 'dotenv/config';
import { expressjwt } from 'express-jwt';
import helmet from 'helmet';
import cors from 'cors';
import buildingRouter from "./routes/buildingRouter.js";
import { CustomException } from './domain/model/customException.js';

const app = express();
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        connectSrc: ['self', 'https://api.ucll.be', 'http://twa.davidvdandenbroeck.com:3000', 'http://twa.davidvdandenbroeck.com:52330'],
    }
}));

const port = process.env.PORT || 3000;

app.use(cors());

app.use(
    expressjwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({
        path: [
            '/users/login',
            '/status',
            '/classrooms/join',
            '/classrooms/get-all',
            '/classrooms/check-energy',
            '/buildings/all',
            '/camps',
            /^\/camps\/id\/\d+$/,
            '/camps/search',
            /^\/workshops\/camp\/\d+$/,
            /^\/workshops\/camp\/\d+\/first$/,
            /^\/workshops\/\d+$/,
            '/mails/send-recover-mail',
            '/users/reset-password',
        ],
    })
);

// Middleware to parse JSON bodie
app.use(express.json());

app.get('/status', (req, res, next) => {
    res.send('Hello World');
});

// Test database connection
app.get('/test-db', async (req, res, next) => {
    try {
        const [results] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ message: 'Database connection successful', results });
    } catch (err) {
        if (err instanceof CustomException)
            res.status(500).json({ error: err.message });
    }
});

app.use('/users', userRouter);
app.use('/classrooms', classroomRouter);
app.use('/workshops', workshopRouter);
app.use('/camps', campRouter);
app.use('/buildings', buildingRouter);
app.use('/sliders', sliderRouter);
app.use('/mails', mailRouter);

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ status: "application error", message: err.message, explanation: err.errorCode });
    } else {
        if (err instanceof CustomException) {
            res.status(400).json({ status: "application error", message: err.message, explanation: err.errorCode });
        } else {
            console.log(err);
            res.status(400).json({ status: "application error", message: err.message, explanation: err.errorCode });
        }
    }
});

app.listen(port, () => {
    console.log(`Node.js HTTP server is running on port ${port}`);
});