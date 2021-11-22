import express from 'express';
import cors from 'cors';
import { signUp, logIn } from './controllers/user.js';
import { getPlan } from './controllers/plans.js';
import { getStates } from './controllers/adresses.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/signup', signUp);

app.post('/login', logIn);

app.get('/plan', getPlan);

app.get('/states', getStates);

export default app;
