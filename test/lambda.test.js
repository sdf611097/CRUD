const expect = require('chai').expect;
const utils = require('ct-js-utils');
const logger = require('ct-logger');

const {pool, ERRORS} = require('../src/model/database');
const User = require('../src/model/user');
const createUser = require('../src/createUser');
const getUserById = require('../src/getUserById');

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
            id = res.id;
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
        user = Object.assign(user, {id});
    });

    it('getUserById', async ()=>{
        let callback;

        // exists
        callback = (err, res)=> {
            expect(res[User.FIELDS.EMAIL]).to.equal(user[createUser.KEYS.email]);
        };
        await getUserById.handler({
            [getUserById.KEYS.ID]: user.id
        }, {}, callback);

        // not exists
        callback = (err, res)=> {
            expect(err).to.deep.equal(ERRORS.NOT_FOUND);
            expect(res).to.be.undefined;
        };
        await getUserById.handler({
            [getUserById.KEYS.ID]: -1
        }, {}, callback);
    });

    after(async()=> {
        try {
            await pool.end();
        }catch (error) {
            return error;
        }
    });
});
