import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    hash: String,
    email: String,
    created: { type: Date, default: Date.now }
});

const exclude = [
    'hash',
    'email',
    '__v'
];
const rename = {
    _id: 'id'
}
userSchema.methods.sanitize = function() {
    const sanitizedUser = {};

    for (let key in this._doc) {
        if (exclude.includes(key)) { continue; }
        if (rename.hasOwnProperty(key)) {
            sanitizedUser[rename[key]] = this[key];
            continue;
        }
        sanitizedUser[key] = this[key];
    }

    return sanitizedUser;
};

const User = mongoose.model('User', userSchema);

export default User;
