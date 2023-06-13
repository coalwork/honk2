import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import * as dotenv from 'dotenv';

import mongoose from './mongoose.js';
import passport from './passport.js';

dotenv.config();

const MongoClient = new Promise(resolve => {
    mongoose.connection.on('connected', () => {
        resolve(mongoose.connection.getClient());
    });
});

const router = express.Router();

router.use(session({
    store: MongoStore.create({
        clientPromise: MongoClient
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

router.use(passport.session());

export default router;
