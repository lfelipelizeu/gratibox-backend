import '../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import app from '../src/app.js';
import { createUser, createSession } from './factories/userFactory.js';
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

describe('GET /plan', () => {
    let session = {};

    beforeAll(async () => {
        session = await createSession();
    });

    afterAll(async () => {
        await connection.query('DELETE FROM sessions;');
        await connection.query('DELETE FROM users;');
    });

    it('return 401 if don\'t recieve a token', async () => {
        const result = await agent
            .get('/plan');
        const { status } = result;

        expect(status).toEqual(401);
    });

    it('return 401 for an invalid session', async () => {
        const header = {
            token: faker.datatype.uuid(),
        };

        const result = await agent
            .get('/plan')
            .set('authorization', header.token);
        const { status } = result;

        expect(status).toEqual(401);
    });

    it('return 200 for a valid token', async () => {
        const header = {
            token: session.token,
        };

        const result = await agent
            .get('/plan')
            .set('authorization', header.token);
        const { status } = result;

        expect(status).toEqual(200);
    });
});

describe('POST /subscribe', () => {
    let session = {};

    beforeAll(async () => {
        session = await createSession();
    });

    afterAll(async () => {
        await connection.query('DELETE FROM delivery_items;');
        await connection.query('DELETE FROM deliveries;');
        await connection.query('DELETE FROM subscriptions;');
        await connection.query('DELETE FROM adresses;');
        await connection.query('DELETE FROM cities;');
        await connection.query('DELETE FROM sessions;');
        await connection.query('DELETE FROM users;');
    });

    it('return 401 for missing token', async () => {
        const body = {
            plan: 'Semanal',
            deliveryDay: faker.datatype.number({ min: 1, max: 6 }),
            items: [faker.datatype.number({ min: 1, max: 3 })],
            shippingAdress: {
                name: faker.name.findName(),
                adress: faker.address.streetAddress(),
                zipcode: faker.address.zipCode().split('-').join(''),
                city: faker.address.cityName(),
                state: faker.datatype.number({ min: 28, max: 54 }),
            },
        };

        const result = await agent
            .post('/subscribe')
            .send(body);
        const { status } = result;

        expect(status).toEqual(401);
    });

    it('return 400 for invalid body', async () => {
        const header = {
            token: session.token,
        };

        const body = {
            plan: 'Semanal',
            deliveryDay: faker.datatype.number({ min: 1, max: 6 }),
            items: [],
            shippingAdress: {
                name: faker.name.findName(),
                adress: faker.address.streetAddress(),
                zipcode: faker.address.zipCode().split('-').join(''),
                city: faker.address.cityName(),
                state: faker.datatype.number({ min: 28, max: 54 }),
            },
        };

        const result = await agent
            .post('/subscribe')
            .send(body)
            .set('authorization', header.token);
        const { status } = result;

        expect(status).toEqual(400);
    });

    it('return 401 for invalid token', async () => {
        const header = {
            token: faker.datatype.uuid(),
        };

        const body = {
            plan: 'Semanal',
            deliveryDay: faker.datatype.number({ min: 1, max: 6 }),
            items: [faker.datatype.number({ min: 1, max: 3 })],
            shippingAdress: {
                name: faker.name.findName(),
                adress: faker.address.streetAddress(),
                zipcode: faker.address.zipCode().split('-').join(''),
                city: faker.address.cityName(),
                state: faker.datatype.number({ min: 28, max: 54 }),
            },
        };

        const result = await agent
            .post('/subscribe')
            .send(body)
            .set('authorization', header.token);
        const { status } = result;

        expect(status).toEqual(401);
    });

    it('return 404 for invalid plan', async () => {
        const header = {
            token: session.token,
        };

        const body = {
            plan: 'Diário',
            deliveryDay: faker.datatype.number({ min: 1, max: 6 }),
            items: [faker.datatype.number({ min: 1, max: 3 })],
            shippingAdress: {
                name: faker.name.findName(),
                adress: faker.address.streetAddress(),
                zipcode: faker.address.zipCode().split('-').join(''),
                city: faker.address.cityName(),
                state: faker.datatype.number({ min: 28, max: 54 }),
            },
        };

        const result = await agent
            .post('/subscribe')
            .send(body)
            .set('authorization', header.token);
        const { status } = result;

        expect(status).toEqual(404);
    });

    it('return 201', async () => {
        const header = {
            token: session.token,
        };

        const body = {
            plan: 'Semanal',
            deliveryDay: faker.datatype.number({ min: 1, max: 6 }),
            items: [faker.datatype.number({ min: 1, max: 3 })],
            shippingAdress: {
                name: faker.name.findName(),
                adress: faker.address.streetAddress(),
                zipcode: faker.address.zipCode().split('-').join(''),
                city: faker.address.cityName(),
                state: faker.datatype.number({ min: 28, max: 54 }),
            },
        };

        const result = await agent
            .post('/subscribe')
            .send(body)
            .set('authorization', header.token);
        const { status } = result;

        expect(status).toEqual(201);
    });
});
