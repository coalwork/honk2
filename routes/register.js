import express from 'express';
import bcrypt from 'bcrypt';

import User from '../models/User.js';
import schema from '../user-validator.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
    const { username, password, email } = req.body;

    let errors;
    try {
        errors = await schema.validateAsync({
            username,
            password,
            email
        }, { abortEarly: false });
    } catch({ details }) {
        return res.status(400).json(details);
    }

    const hash = await bcrypt.hash(password, 12);

    const user = new User({
        name: username,
        hash,
        email
    });
    
    try {
        await user.save();
    } catch(error) {
        console.error(error);
        return res.status(500).json({ info: 'server error, please contact administrator at coalwork@proton.me' });
    }
    
    req.login(user, () => res.status(201).json({}));
});

export default router;
