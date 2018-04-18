const Sequelize = require('sequelize');
const sequelize = require('./database');

//alias
const DataTypes = Sequelize;

const FIELDS = {
    ID: 'id',
    EMAIL: 'user_email',
    NAME: 'user_name',
    PASSWORD: 'user_password',
};

const ERRORS = {
    NOT_FOUND: {
        msg: 'not found',
        code: 1000,
    },
    INVALID_EMAIL: {
        msg: 'email is invalid',
        code: 1001,
    },
};

const User = sequelize.define('user', {

    // We should avoid id with auto increment,
    // because we used to using id in endpoints.
    // Once someone has known rest api format,
    // he/she can iterate the index to
    // get our db information(if no auth).
    [FIELDS.ID]: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    [FIELDS.EMAIL]: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    [FIELDS.NAME]: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    [FIELDS.PASSWORD]: {
        type: DataTypes.STRING(300),
        allowNull: false,
    },
});

exports.create = async function (name, email, password) {
    const user = await User.create({
        [FIELDS.NAME]: name,
        [FIELDS.EMAIL]: email,
        [FIELDS.PASSWORD]: password,
    });
    return user.toJSON();
};

exports.getById = async function (id) {
    const user = await User.findById(id);
    if (!user) {
        throw ERRORS.NOT_FOUND;
    }

    return user.toJSON();
};

exports.updateUserName = async function updateUserName(id, newName) {
    const result = await User.update({ [FIELDS.NAME]:  newName }, {
        where: { id },
    });
    if (result[0] === 0) {
        throw new Error('No row be updated');
    }
};

exports.deleteById = async function deleteById(id) {
    const result = await User.destroy({
        where: { id },
    });
    if (result > 1) {
        throw new Error('This case should not happened!!');
    }else if (result == 0) {
        throw new Error('Nothing be deleted');
    }
};

exports.FIELDS = FIELDS;
exports.ERRORS = ERRORS;
