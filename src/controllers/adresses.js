import connection from '../database/database.js';

async function getStates(req, res) {
    try {
        const result = await connection.query('SELECT * FROM states ORDER BY name ASC;');
        const states = result.rows;
        res.status(200).send(states);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    getStates,
};
