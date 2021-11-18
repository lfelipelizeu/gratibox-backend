import bcrypt from 'bcrypt';
import connection from '../database/database.js';
import validationSignUpError from '../validation/signUp.js';

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

export {
    signUp,
};
