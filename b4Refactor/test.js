const User = require('../user');
const expect = require('chai').expect;

const utils = require('ct-js-utils');
const logger = require('ct-logger');
const db = require('../database');

describe('User', function () {
    let user = {};
    before(()=> {
        const name = utils.getNewId(10);
        user = Object.assign(user, {
            name: name,
            email: `${name}@test.com`,
            password: 'password',
        });
    });

    it('create', async function() {

        //invalid email case
        let result;
        try {
            result = await User.create(user.name, 'invalid email', user.password);
            logger.red(result);
            return new Error('Why validator not work as expected?');
        }catch (err) {
            logger.cyan(err);
            expect(err.errors[0].type).to.equal('Validation error');
            expect(err.errors[0].validatorKey).to.equal('isEmail');
        }

        // create normally
        result = await User.create(user.name, user.email, user.password);
        user = Object.assign(user, {
            id: result.id,
        });
        expect(user.id).to.not.be.undefined;

        //duplicate create should fail
        try {
            const result = await User.create(user.name, user.email, user.password);
            logger.red(result);
            return new Error('Same user name but create successfully?');
        }catch (err) {
            expect(err.errors[0].type).to.equal('unique violation');
        }
    });

    it('getById', async () => {

        let result = await User.getById(user.id);
        expect(result.user_name).to.equal(user.name);
        try {
            result = await User.getById(-1);
            logger.red(result);
            throw new Error('UserId== -1, exists?');
        }catch (err) {
            expect(err).to.deep.equal(User.ERRORS.NOT_FOUND);
        }

    });

    it('updateName', async () => {
        const newName = 'newName';

        let result = await User.updateUserName(user.id, newName);

        result = await User.getById(user.id);
        expect(result.user_name).to.equal(newName);
        user = Object.assign(user, {
            name: newName,
        });
        logger.yellow('ok');

    });

    it('delete', async ()=> {
        await User.deleteById(user.id);
        console.log('deleted');
        try {
            const result = await User.getById(user.id);
            logger.red(result);
            throw new Error(`UserId==${user.id}, after delete still exists?`);
        }catch (err) {
            expect(err).to.deep.equal(User.ERRORS.NOT_FOUND);
        }
    });

    after(async()=> {
        try {
            await db.close();
        }catch (error) {
            return error;
        }
    });
});
