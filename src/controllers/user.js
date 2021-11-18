import bcrypt from 'bcrypt';
import connection from '../database/database.js';
import validationSignUpError from '../validation/signUp.js';
import { v4 as uuid } from 'uuid';

async function signUp(req, res) {
    const {
        name, email, password,
    } = req.body;

    if (validationSignUpError(req.body)) return res.sendStatus(400);

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, passwordHash]);

        return res.sendStatus(201);
    } catch (error) {
        const { constraint } = error;
        if (constraint === 'users_email_key') return res.status(409).send('email');

        return res.sendStatus(500);
    }
}

async function logIn(req, res) {
    const { email, password } = req.body;

    if (!email || !password) return res.sendStatus(400);

    try {
        const result = await connection.query('SELECT * FROM users WHERE email = $1;', [email]);
        const user = result.rows[0];

        if (!user) return res.sendStatus(404);
        if (!bcrypt.compareSync(password, user.password)) return res.sendStatus(401);

        const result2 = await connection.query('SELECT * FROM sessions WHERE user_id = $1;', [user.id]);
        const session = result2.rows[0];

        user.token = session ? session.token : uuid();

        if (!session) await connection.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2);', [user.id, user.token]);

        res.status(200).send({
            name: user.name,
            token: user.token,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export {
    signUp,
    logIn,
};
