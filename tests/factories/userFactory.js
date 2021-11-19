import faker from 'faker';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../../src/database/database.js';

async function createUser() {
    const user = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(8),
    };

    const passwordHash = bcrypt.hashSync(user.password, 10);

    const result = await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [user.name, user.email, passwordHash]);
    user.id = result.rows[0].id;

    return user;
}

async function createSession() {
    const user = await createUser();

    const session = {
        userId: user.id,
        token: uuid(),
    };

    await connection.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2) RETURNING *;', [session.userId, session.token]);

    return session;
}

export {
    createUser,
    createSession,
};
