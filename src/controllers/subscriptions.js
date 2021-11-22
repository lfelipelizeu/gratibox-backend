import dayjs from 'dayjs';
import connection from '../database/database.js';

function calculateNextDelivery(planOption, day) {
    const baseDate = planOption === 'Semanal' ? dayjs().day(day) : dayjs().date(day);

    if (baseDate.isBefore(dayjs()) && planOption === 'Mensal') return baseDate.add(1, 'month');

    while (baseDate.isBefore(dayjs())) {
        baseDate.add(1, 'week');
    }

    return baseDate;
}

async function newSubscription(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const {
        plan, deliveryDay, items, shippingAdress,
    } = req.body;
    const {
        name, adress, zipcode, city, state,
    } = shippingAdress;

    if (!token) return res.sendStatus(401);
    if (!plan || !deliveryDay || items.length === 0) return res.sendStatus(400);
    if (!name || !adress || !zipcode || !city || !state) return res.sendStatus(400);

    try {
        const result = await connection.query('SELECT users.id FROM users JOIN sessions ON sessions.user_id = users.id WHERE sessions.token = $1;', [token]);
        const user = result.rows[0];

        if (!user) return res.sendStatus(401);

        const result2 = await connection.query('SELECT * FROM plans WHERE name = $1;', [plan]);
        const chosenPlan = result2.rows[0];

        if (!chosenPlan) return res.sendStatus(404);

        const result3 = await connection.query('INSERT INTO cities (name, state_id) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET name = $3 RETURNING *;', [city, state, city]);
        const shippingCity = result3.rows[0];

        const result4 = await connection.query('INSERT INTO adresses (name, adress, zipcode, city_id) VALUES ($1, $2, $3, $4) RETURNING *;', [name, adress, zipcode, shippingCity.id]);
        const insertedShippingAdress = result4.rows[0];

        const result5 = await connection.query('INSERT INTO subscriptions (user_id, plan_id, adress_id, subscription_date, day) VALUES ($1, $2, $3, $4, $5) RETURNING *;', [user.id, chosenPlan.id, insertedShippingAdress.id, dayjs(), deliveryDay]);
        const createdSubscription = result5.rows[0];

        let itemsQuery = 'INSERT INTO delivery_items (subscription_id, item_id) VALUES ';
        const itemsParams = [];

        items.forEach((item, index) => {
            itemsQuery += `($${itemsParams.length + 1}, $${itemsParams.length + 2})`;
            itemsParams.push(createdSubscription.id);
            itemsParams.push(item);

            if (index + 1 < items.length) {
                itemsQuery += ',';
            }
        });

        await connection.query(`${itemsQuery};`, itemsParams);

        const nextDelivery = calculateNextDelivery(plan, deliveryDay);

        await connection.query('INSERT INTO deliveries (subscription_id, expected_date) VALUES ($1, $2);', [createdSubscription.id, nextDelivery]);

        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export {
    newSubscription,
};
