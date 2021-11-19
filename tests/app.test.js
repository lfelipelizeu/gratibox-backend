import '../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import { createUser } from './factories/userFactory.js';
import connection from '../src/database/database.js';

const agent = supertest(app);
faker.locale = 'pt_BR';

describe('POST /signup', () => {
    let user = {};

    beforeAll(async () => {
        user = await createUser();
    });

    afterAll(async () => {
        await connection.query('DELETE FROM users;');
    });

    it('return 400 for missing data', async () => {
        const body = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(8),
        };

        const result = await agent
            .post('/signup')
            .send(body);
        const { status } = result;

        expect(status).toEqual(400);
    });

    it('return 409 for an email conflict', async () => {
        const body = {
            name: faker.name.findName(),
            email: user.email,
            password: faker.internet.password(8, false, /^[a-zA-Z0-9]*$/),
        };

        body.repeatPassword = body.password;

        const result = await agent
            .post('/signup')
            .send(body);
        const { status } = result;

        expect(status).toEqual(409);
    });

    it('return 201 for valid data', async () => {
        const body = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(8, false, /^[a-zA-Z0-9]*$/),
        };

        body.repeatPassword = body.password;

        const result = await agent
            .post('/signup')
            .send(body);
        const { status } = result;

        expect(status).toEqual(201);
    });
});

describe('POST /login', () => {
    let user = {};

    beforeAll(async () => {
        user = await createUser();
    });

    afterAll(async () => {
        await connection.query('DELETE FROM sessions;');
        await connection.query('DELETE FROM users;');
    });

    it('return 400 for missing data', async () => {
        const body = {
            email: faker.internet.email(),
        };

        const result = await agent
            .post('/login')
            .send(body);
        const { status } = result;

        expect(status).toEqual(400);
    });

    it('return 404 for not registered email', async () => {
        const body = {
            email: faker.internet.email(),
            password: faker.internet.password(8),
        };

        const result = await agent
            .post('/login')
            .send(body);
        const { status } = result;

        expect(status).toEqual(404);
    });

    it('return 401 for wrong password', async () => {
        const body = {
            email: user.email,
            password: faker.internet.password(8),
        };

        const result = await agent
            .post('/login')
            .send(body);
        const { status } = result;

        expect(status).toEqual(401);
    });

    it('return 200 for valid user', async () => {
        const body = {
            email: user.email,
            password: user.password,
        };

        const result = await agent
            .post('/login')
            .send(body);
        const { status } = result;

        expect(status).toEqual(200);
    });
});