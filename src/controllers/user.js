import connection from '../database/database.js';
import validationSignUpError from '../validation/signUp.js'; //

async function signUp(req, res) {
    const {
        name, email, password, repeatPassword,
    } = req.body;

    if (validationSignUpError(req.body)) return res.sendStatus(400);
}

export {
    signUp,
};
