const expect = require('chai').expect;
const utils = require('ct-js-utils');
const logger = require('ct-logger');

const {pool, ERRORS} = require('../src/model/database');
const User = require('../src/model/user');
const createUser = require('../src/createUser');
const getUserById = require('../src/getUserById');
const updateUserName = require('../src/updateUserName');
const deleteUserById = require('../src/deleteUser');

const callbackNotFound = (err, res)=> {
    expect(err).to.deep.equal(ERRORS.NOT_FOUND);
    expect(res).to.be.undefined;
};

const callbackNoErr = (err, res)=>{
    expect(err).to.be.null;
    expect(res).to.be.undefined;
};

describe('User', function () {
    let user = {};
    before(()=> {
        const name = utils.getNewId(10);
        user = Object.assign(user, {
            [createUser.KEYS.name]: name,
            [createUser.KEYS.email]: `${name}@test.com`,
            [createUser.KEYS.password]: 'password',
        });
    });

    it('createUser', async ()=> {
        let callback, id;
        //ToDo: invalid email case

        // create normally
        callback= (err, res)=> {
            expect(res.id).to.not.be.undefined;
            id = res[User.FIELDS.ID];
        };
        await createUser.handler(user, {}, callback);

        //duplicate create should fail
        callback= (err, res)=> {
            expect(err).to.deep.equal(ERRORS.UNIQUE_VIOLATION);
            expect(res).to.be.undefined;
            if(res) logger.red(res);
        };

        await createUser.handler(user, {}, callback);

        //assign id for other test case
        user = Object.assign(user, {[User.FIELDS.ID]: id});
    });

    it('getUserById', async ()=>{
        let callback;

        // exists
        callback = (err, res)=> {
            expect(res[User.FIELDS.EMAIL]).to.equal(user[createUser.KEYS.email]);
        };
        await getUserById.handler({
            [getUserById.KEYS.ID]: user[User.FIELDS.ID]
        }, {}, callback);

        // not exists
        await getUserById.handler({
            [getUserById.KEYS.ID]: -1
        }, {}, callbackNotFound);
    });

    it('updateUserName', async() =>{
        let callback;
        let newName = utils.getNewId(10);
        callback = (err, res)=>{
            expect(err).to.be.null;
            expect(res).to.be.undefined;
        };
        await updateUserName.handler({
            [updateUserName.KEYS.ID]: user[User.FIELDS.ID],
            [updateUserName.KEYS.NEW_NAME]: newName,
        }, {}, callback);

        // retrieve it from db to check results
        callback = (err, res)=>{
            expect(err).to.be.null;
            expect(res[User.FIELDS.NAME]).to.equal(newName);
        };

        await getUserById.handler({
            [getUserById.KEYS.ID]: user[User.FIELDS.ID],
        }, {}, callback);
    });

    it('deleteUserById', async()=> {

        // delete normally
        await deleteUserById.handler({
            [getUserById.KEYS.ID]: user[User.FIELDS.ID],
        }, {}, callbackNoErr);

        // delete it again
        await deleteUserById.handler({
            [getUserById.KEYS.ID]: user[User.FIELDS.ID],
        }, {}, callbackNotFound);
    });

    after(async()=> {
        try {
            await pool.end();
        }catch (error) {
            return error;
        }
    });
});
