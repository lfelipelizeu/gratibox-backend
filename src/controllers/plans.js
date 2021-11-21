import dayjs from 'dayjs';
import connection from '../database/database.js';

async function getPlan(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) return res.sendStatus(401);

    try {
        const result = await connection.query('SELECT users.* FROM users JOIN sessions ON sessions.user_id = users.id WHERE sessions.token = $1;', [token]);
        const user = result.rows[0];

        if (!user) return res.sendStatus(401);

        const result2 = await connection.query('SELECT plans.name AS plan, subscriptions.subscription_date, items.name AS item, deliveries.expected_date AS next_delivery FROM subscriptions JOIN plans ON plans.id = subscriptions.plan_id JOIN delivery_items ON delivery_items.subscription_id = subscriptions.id JOIN items ON items.id = delivery_items.item_id JOIN deliveries ON deliveries.subscription_id = subscriptions.id WHERE user_id = $1;', [user.id]);
        const plan = result2.rows;

        const nextDelivery = dayjs(plan[0]?.next_delivery);
        const nextDeliveries = [nextDelivery];
        nextDeliveries.push(nextDelivery.add(1, plan[0]?.plan === 'Mensal' ? 'month' : 'week'));
        nextDeliveries.push(nextDelivery.add(2, plan[0]?.plan === 'Mensal' ? 'month' : 'week'));

        return res.status(200).send({
            plan: plan[0]?.plan,
            subscriptionDate: plan[0]?.subscription_date,
            nextDeliveries: nextDeliveries.map((date) => {
                if (date.day() === 6) return date.add(2, 'day');
                if (date.day() === 0) return date.add(1, 'day');
                return date;
            }),
            items: plan.map((item) => item.item),
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export {
    getPlan,
};
