const expect = require('chai').expect;

const {pool, ERRORS} = require('../src/model/database');
const {handler, KEYS} = require('../src/createUser');
const utils = require('ct-js-utils');
const logger = require('ct-logger');

describe('User', function () {
    let user = {};
    before(()=> {
        const name = utils.getNewId(10);
        user = Object.assign(user, {
            [KEYS.name]: name,
            [KEYS.email]: `${name}@test.com`,
            [KEYS.password]: 'password',
        });
    });

    it('createUser', async function() {
        let callback, id;
        //invalid email case

        // create normally
        callback= function(err, res){
            expect(res.id).to.not.be.undefined;
            id = res.id;
        };
        await handler(user, {}, callback);

        //duplicate create should fail
        callback= function(err, res){
            expect(err).to.deep.equal(ERRORS.UNIQUE_VIOLATION);
            expect(res).to.be.undefined;
            if(res) logger.red(res);
        };

        await handler(user, {}, callback);

        //assign id for other test case
        user = Object.assign(user, {id});
    });
    after(async()=> {
        try {
            await pool.end();
        }catch (error) {
            return error;
        }
    });
});
