import bcrypt from 'bcrypt';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import User from './models/User.js';

passport.use(new LocalStrategy(async (username, password, done) => {
    let user;

    try {
        user = await User.findOne({ name: username });
    } catch(error) {
        console.error(`error while fetching user "${username}" during authentication: ${error}`);
        return done(error);
    }
    if (!user) { return done(null, false, `user "${username}" not found`); }
    if (!await bcrypt.compare(password, user.hash)) {
        return done(null, false, 'password does not match');
    }

    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    let user;

    try {
        user = await User.findById(id);
    } catch(error) {
        return done(error, user);
    }
        
    done(null, user);
});

export default passport;
