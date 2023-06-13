import express from 'express';
import User from './models/User.js';
import passport from './passport.js';

const router = express.Router();

router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) { return res.redirect(303, '/home'); }
    res.redirect(`/profile/${req.user.name}`);
});

router.get('/profile/:username', async (req, res) => {
    if (req.isAuthenticated() && req.user.name === req.params.username) {
        res.render('profile', {
            user: req.user.sanitize(),
            foundUser: req.user.sanitize(),
            isSelf: true
        });
        return;
    }

    const user = await User.findOne({ name: req.params.username });
    const context = {};

    if (!user) {
        context.notFound = true;
        res.status(404);
    } else {
        context.foundUser = user.sanitize();
    }

    if (req.isAuthenticated()) { context.user = req.user.sanitize(); }

    res.render('profile', context);
});

export default router;
