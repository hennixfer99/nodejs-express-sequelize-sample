const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');

// import your app here
const app = require('../src/study');
const agent = supertest.agent(app);

describe('User API Test', () => {

    before(async () => {
        // run a single time before tests
    });

    beforeEach(async () => {
        // run N times before each test
    });

    it('test hello-world route', async () => {
        const res = await agent.get('/hello-world');
        expect(res.statusCode).to.be.equals(200);
        expect(res.text).to.be.equals('Hello world!');
    });

    it('test hello-world route using query param', async () => {
        const res = await agent.get('/hello-world?name=zeca');
        expect(res.statusCode).to.be.equals(200);
        expect(res.text).to.be.equals('Hello zeca!');
    });

    it('test hello-world route using path param', async () => {
        const res = await agent.get('/hello-world/zeca');
        expect(res.statusCode).to.be.equals(200);
        expect(res.text).to.be.equals('Hello zeca!');
    });

    afterEach(async () => {
        // run N times after each test
    });

    after(async () => {
        // run a single time after tests
    });

});
