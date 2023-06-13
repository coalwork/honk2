import express from 'express';

const router = express.Router();

router.post('/logout', (req, res) => {
    req.logout(() => res.json({}));
});

export default router;

