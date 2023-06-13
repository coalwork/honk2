import express from 'express';

import hbs from './handlebars.js';
import router from './router.js';
import { default as session } from './session.js';
import { main } from './mongoose.js';

const app = express();

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

main();

app.use(express.urlencoded({ extended: true }));

app.use(session);

app.use(router);

export default app;
