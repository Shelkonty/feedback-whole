import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Что-то пошло не так!' });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

export default app;