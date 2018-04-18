const { deleteById, FIELDS } = require('./model/user');

const KEYS = {
    ID: FIELDS.ID,
};

exports.KEYS = KEYS;

exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const res = await deleteById(event[KEYS.ID]);
        callback(null, res);
    }catch (err) {
        callback(err);
    }
};
