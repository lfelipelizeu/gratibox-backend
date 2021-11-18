import joi from 'joi';

export default function validationSignUpError(object) {
    const signUpSchema = joi.object({
        name: joi.string().trim().min(3).max(50)
            .required(),
        email: joi.string().trim().email().max(50)
            .required(),
        password: joi.string().alphanum().min(5).max(16)
            .required(),
        repeatPassword: joi.ref('password'),
    }).with('password', 'repeatPassword');

    const { error } = signUpSchema.validate(object);

    return error;
}
