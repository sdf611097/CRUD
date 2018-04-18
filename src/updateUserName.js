const { updateName, FIELDS } = require('./model/user');

const KEYS = {
    ID: FIELDS.ID,
    NEW_NAME: 'name',
};

exports.KEYS = KEYS;

exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const res = await updateName(event[KEYS.ID], event[KEYS.NEW_NAME]);
        callback(null, res);
    }catch (err) {
        callback(JSON.stringify(err));
    }
};
