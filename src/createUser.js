const { create } = require('./model/user');

const KEYS = {
    email: 'email',
    name: 'name',
    password: 'password',
};

exports.KEYS = KEYS;

exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const res = await create(event[KEYS.email], event[KEYS.name], event[KEYS.password]);
        callback(null, res);
    }catch (err) {
        callback(err);
    }
};
