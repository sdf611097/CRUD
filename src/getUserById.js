const {getById} = require('./model/user');

const KEYS = {
    ID: 'id',
};

exports.KEYS = KEYS;

exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try{
        const res = await getById(event[KEYS.ID]);
        callback(null, res);
    }catch (err){
        callback(err);
    }
};
