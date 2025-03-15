import express from 'express';
import {PORT} from './config.js';
import usersRoutes from './routes/users.routes.js';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // URL permitida
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type'] // Headers permitidos
  }));


app.use(morgan('dev'));
app.use(express.json());
app.use(usersRoutes);

app.listen(PORT);
console.log('Server on port', PORT);