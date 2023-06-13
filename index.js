import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import app from './app.js';

dotenv.config();

if (!process.env.PORT) { throw Error('please specify environment variable "PORT"'); }

app.listen(process.env.PORT, error => {
    console.log(`app listening on port ${process.env.PORT}`);
});
