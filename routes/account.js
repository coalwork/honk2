import express from 'express';
import User from '../models/User.js';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.delete('/account', (req, res) => {
    if (req.query.hasOwnProperty('self')) {
        if (!req.isAuthenticated()) {
            res.status(401).json({});
            return;
        }

        return res.redirect(307, `/api/account/${req.user.name}`);
    }
    res.status(400).json({ info: 'add "self" query parameter to request to delete own account' });
});

router.delete('/account/:username', async (req, res) => {
    const username = req.params.username;

    if (!req.isAuthenticated() || req.user.name !== username) {
        if (req.body.password !== process.env.ADMINPASS) { 
            res.status(403).json({});
            return;
        }

        const user = await User.findOneAndDelete({
            name: username
        }).lean();

        if (!user) { return res.status(404).json({}); }

        return res.json(user || {});
    }

    const user = await User.findOneAndDelete({ name: username }).lean();

    req.logout(() => res.json(user || {}));
});

export default router;
