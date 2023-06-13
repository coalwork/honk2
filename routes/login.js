import express from 'express';

import passport from '../passport.js';

const router = express.Router();

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    passport.authenticate('local', (error, user, info) => {
        if (error) {
            return res.status(500).json(error);
        }
        if (!user) {
            if (typeof info === 'object') {
                return res.status(400).json({ error: 'missing credentials' });
            }
            return res.status(401).json({ info });
        }
        
        req.login(user, () => res.json({}));
    })(req, res, next);
});

export default router;
