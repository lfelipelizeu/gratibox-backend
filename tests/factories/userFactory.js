import faker from 'faker';
import bcrypt from 'bcrypt';
import connection from '../../src/database/database.js';

async function createUser() {
    const user = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(8),
    };

    const passwordHash = bcrypt.hashSync(user.password, 10);

    const result = await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [user.name, user.email, passwordHash]);
    user.id = result.id;

    return user;
}

export {
    createUser,
};
