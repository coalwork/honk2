import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import { create } from 'express-handlebars';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viewFilenames = fs.readdirSync(path.join(__dirname, 'views'))
    .filter(name => /^\d+\D+\.hbs/.test(name))
    .map(name => {
        const groups = /(\d+)(\D+)\.hbs/.exec(name);
        if (!groups) { return {}; }
        return { order: groups[1], name: groups[2] };
    });

const hbs = create({
    extname: '.hbs',
    helpers: {
        title(view) { return view.replace(/^\d+/, ''); },
        viewInfo() { return viewFilenames; }
    }
});

export const router = express.Router();

// automatically serve paths with matching views
router.get('/:view', (req, res, next) => {
    const { view } = req.params;
    const search = ({ name }) => name === view;
    const { order, name } = viewFilenames.find(search) || {};

    if (!name) { return next(); }

    const context = {};
    if (req.isAuthenticated()) { context.user = req.user.sanitize(); }
    res.render(order + name, context);
});

export default hbs;
