import express from 'express';
import cors from 'cors';
import { signUp, logIn } from './controllers/user.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/signup', signUp);

app.post('/login', logIn);

export default app;
