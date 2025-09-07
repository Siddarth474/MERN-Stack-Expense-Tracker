import Joi from 'joi';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerValidation = (req, res, next) => {
    const schema = Joi.object({
        fullname: Joi.string().min(4).max(100).required(),
        username: Joi.string().min(4).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const {error} = schema.validate(req.body);
    
    if(error) {
        return res.status(400)
            .json(new ApiResponse(400, error, "bad request"));
    }
    next();
}

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400)
            .json(new ApiResponse(400, error, "bad request"));
    }
    next();
}

export {
    registerValidation,
    loginValidation
}