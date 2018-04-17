const { query, COMMON_FIELDS } = require('./database');

const FIELDS = Object.assign({
    ID: 'id',
    EMAIL: 'user_email',
    NAME: 'user_name',
    PASSWORD: 'user_password',
}, COMMON_FIELDS);

async function create(email, name, password) {
    const text = `INSERT INTO users (${FIELDS.NAME}, ${FIELDS.EMAIL}, ${FIELDS.PASSWORD}, "${FIELDS.createdAt}", "${FIELDS.updatedAt}") VALUES ($1, $2, $3, $4, $5) RETURNING id`;

    const res = await query(text, [name, email, password, new Date(), new Date()]);
    return res.rows[0];
}

exports.create = create;