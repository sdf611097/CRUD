const { Pool } = require('pg');
const {DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME} = require('./config');

const COMMON_FIELDS = {
    /* eslint-disable */
    createdAt: `"createdAt"`,
    updatedAt: `"updatedAt"`,
    /* eslint-enable */
};

// code < 0 => custom
// others https://www.postgresql.org/docs/10/static/errcodes-appendix.html
const ERRORS = {
    ARGS_LEN_NOT_MATCH: {
        code: -5566,
        message: 'args length not match in sqlText',
    },
    NOT_FOUND: {
        code: -404,
        message: 'Not found',
    },
    UNIQUE_VIOLATION: {
        code: 23505,
        message: 'duplicate key value violates unique constraint',
    },
};

let ERR_LOOKUP = {};

for (let err of Object.keys(ERRORS)){
    ERR_LOOKUP = Object.assign(ERR_LOOKUP, {
        [ERRORS[err].code]: ERRORS[err]
    });
}

const pool = new Pool({
    user: DB_USERNAME,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
    host: DB_HOST,
});

const query = async function(sqlText, args) {
    if ((sqlText.split('$').length -1) !== args.length){
        throw ERRORS.ARGS_LEN_NOT_MATCH;
    }
    try{
        return await pool.query(sqlText, args);
    } catch(err) {
        throw errHandler(err);
    }
};

function errHandler(err) {
    if (ERR_LOOKUP[err.code]){
        console.log(err.detail);
        return ERR_LOOKUP[err.code];
    }else {
        return err;
    }
}

exports.COMMON_FIELDS = COMMON_FIELDS;
exports.ERRORS = ERRORS;
exports.pool = pool;
exports.query = query;