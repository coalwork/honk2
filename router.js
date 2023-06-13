import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

import { router as routerHbs } from './handlebars.js';
import { default as routerProfile } from './profile.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

(await Promise.all(
    fs.readdirSync(path.join(__dirname, 'routes'))
        .filter(filename => filename.endsWith('.js'))
        .map(filename =>
            import('file://' + path.join(__dirname, 'routes', filename))
        )
)).forEach(({ default: route }) => router.use('/api', route));

router.use('/api', (req, res) => {
    res.status(404).json({});
});

router.get('/', (req, res) => res.redirect('/home'));

router.use(routerProfile);

router.use(routerHbs);

router.use(express.static('public'));

router.get('/styles/:name.css', (req, res) => {
    res.type('css').end();
});

router.get('/scripts/:name.js', (req, res) => {
    res.type('js').end();
});

router.use((req, res) => {
    res.render('error', {
        statusCode: 404,
        method: req.method.toLowerCase(),
        path: req.path,
        info: `path ${req.path} does not exist`
    });
});

export default router;
