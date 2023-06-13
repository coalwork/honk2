import Joi from 'joi';

import User from './models/User.js';

const findUser = async (name, helpers) => {
    let userExists;

    try {
        userExists = await User.exists({ name });
    } catch(error) {
        console.error(`error while fetching user "${name}": ${error}`);
        return helpers.message('server error, please retry request');
    }

    if (userExists) {
        return helpers.message(`username "${name}" already taken`);
    }
};

export const username = Joi.string()
    .required()
    .$
    .min(4)
    .max(24)
    .message('username must be between 4-24 characters long')
    .pattern(/^[0-9A-Za-z-_.]+$/, 'username')
    .message('username must only contain alphanumeric characters and/or dashes (-), underscores (_), or periods (.)')
    .external(findUser, 'duplicate');

export const password = Joi.string()
    .required()
    .max(300);

export const email = Joi.string()
    .required()
    .email();

const schema = Joi.object({ username, password, email });

export default schema;
