const { query, COMMON_FIELDS, ERRORS } = require('./database');

const FIELDS = Object.assign({
    ID: 'id',
    EMAIL: 'user_email',
    NAME: 'user_name',
    PASSWORD: 'user_password',
}, COMMON_FIELDS);

async function create(email, name, password) {
    const text = `INSERT INTO users (${FIELDS.NAME}, ${FIELDS.EMAIL}, ${FIELDS.PASSWORD}, ${FIELDS.createdAt}, ${FIELDS.updatedAt}) VALUES ($1, $2, $3, $4, $5) RETURNING id`;

    const res = await query(text, [name, email, password, new Date(), new Date()]);
    return res.rows[0];
}

async function getById(id) {
    const fields = Object.keys(FIELDS).filter(key=> key!=='PASSWORD').map(key=> FIELDS[key]).join(',');
    const text = `select ${fields} from users where ${FIELDS.ID}=$1`;
    const res = await query(text, [id]);
    if (res.rows.length === 0){
        throw ERRORS.NOT_FOUND;
    }
    return res.rows[0];
}

async function updateName(id, newName) {
    const text = `Update users SET ${FIELDS.NAME}=$1 WHERE ${FIELDS.ID}=$2`;
    const res = await query(text, [newName, id]);
    if(res.rowCount > 1){
        throw new Error('This case should not happen!');
    }else if(res.rowCount === 0) {
        throw ERRORS.NOTHING_UPDATED;
    }
}

async function deleteById(id) {
    const text = `DELETE FROM users WHERE ${FIELDS.ID}= $1`;
    const res = await query(text, [id]);
    if(res.rowCount > 1){
        throw new Error('[Important!!] Multi user be deleted.. , shutdown it immediately!!');
    }else if(res.rowCount ===0){
        throw ERRORS.NOT_FOUND;
    }
}

exports.create = create;
exports.getById = getById;
exports.updateName = updateName;
exports.deleteById = deleteById;
exports.FIELDS = FIELDS;
