const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');

const expenseControl = require("../src/controllers/expenseController.js")

const app = require('../src/routes/routes.js');
const agent = supertest.agent(app);

describe('User API Test', () => {

    before(async () => {
        // run a single time before tests
    });

    beforeEach(async () => {
        // run N times before each test
    });

    it('test create bill route', async () => {
        const res = await agent.post('/expense-controll').send({
            price: 35,
            bill: "testinho",
            category: "teste"
        });

        expect(res.statusCode).to.be.equals(200);
    });

    it('test get bills route', async () => {
        const res = await agent.get('/expense-controll', expenseControl.getBills());

        expect(res.statusCode).to.be.equals(200);
    });

    it('test update bill route', async () => {
        const res = await agent.put('/expense-controll/1').send({
            price: 45,
            bill: "testinho",
            category: "teste"
        });;
        expect(res.statusCode).to.be.equals(200);
    });

    it('test delete bill route', async () => {
        const res = await agent.delete('/expense-controll/1');
        expect(res.statusCode).to.be.equals(200);
    });


    afterEach(async () => {
        // run N times after each test
    });

    after(async () => {
        // run a single time after tests
    });

});
