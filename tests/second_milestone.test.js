const chai = require('chai');
const expect = chai.expect;
const { sequelize } = require('../src/database/api')
const supertest = require('supertest');

const app = require('../src/routes/routes.js');
const agent = supertest.agent(app);

describe('API Test', () => {

    before(async () => {
        await sequelize.sync()
        await sequelize.authenticate()
    });

    beforeEach(async () => {
    });

    it('test create bill route', async () => {
        const res = await agent.post('/expense-controll').send({
            price: 35,
            bill: "testinho",
            category: "teste",
        });

        expect(res.statusCode).to.be.equals(201);
        expect(res.body.price).to.be.equals(35);
        expect(res.body.bill).to.be.equals('testinho');
        expect(res.body.category).to.be.equals('teste');

        await agent.delete(`/expense-controll/${res.body.id}`);
    });

    it('test create bill route error price is a string', async () => {
        const res = await agent.post('/expense-controll').send({
            price: "teste",
            bill: "testinho",
            category: "teste"
        });

        expect(res.statusCode).to.be.equals(400);
        expect(res.body).to.deep.equals({ message: "Parâmetro inválido" });
    });

    it('test get bills route', async () => {
        const resPost = await agent.post('/expense-controll').send({
            price: 35,
            bill: 'testinho',
            category: 'teste'
          });

          const resGet = await agent.get('/expense-controll');

          expect(resGet.statusCode).to.be.equals(200);
          expect(resGet.body.length).to.be.equals(1);

          const retrievedBill = resGet.body[0];

          expect(retrievedBill.bill).to.be.equals('testinho');
          expect(retrievedBill.category).to.be.equals('teste');

          await agent.delete(`/expense-controll/${retrievedBill.id}`);

          const resGetAfterDelete = await agent.get('/expense-controll');

          expect(resGetAfterDelete.statusCode).to.be.equals(200);
          expect(resGetAfterDelete.body).to.deep.equal([]);
        });

    it('test update bill route', async () => {
        const resPost = await agent.post('/expense-controll').send({
            price: 35,
            bill: 'testinho',
            category: 'teste'
          });
        const resUpdate = await agent.put(`/expense-controll/${resPost.body.id}`).send({
            price: 45,
            bill: "testinho123",
            category: "teste222"
        });
        expect(resUpdate.statusCode).to.be.equals(200);
        expect(resUpdate.body.price).to.be.equals(45);
        expect(resUpdate.body.bill).to.be.equals('testinho123');
        expect(resUpdate.body.category).to.be.equals('teste222');

        await agent.delete(`/expense-controll/${resPost.body.id}`);

        const resGetAfterDelete = await agent.get('/expense-controll');

        expect(resGetAfterDelete.statusCode).to.be.equals(200);
        expect(resGetAfterDelete.body).to.deep.equal([]);
    });

    it('test update bill error route', async () => {
        const resUpdate = await agent.put(`/expense-controll/-1`).send({
            price: 45,
            bill: "testinho123",
            category: "teste222"
        });
        expect(resUpdate.statusCode).to.be.equals(404);
        expect(resUpdate.body).to.deep.equals({ message: "Gasto não existe" });
    })

    it('test delete bill route', async () => {

        const resPost = await agent.post('/expense-controll').send({
            price: 35,
            bill: 'testinho',
            category: 'teste'
          });

        const resDelete = await agent.delete(`/expense-controll/${resPost.body.id}`);
        expect(resDelete.statusCode).to.be.equals(200);
        expect(resDelete.body).to.deep.equals({ message: "Gasto deletado :)" });
    });


    afterEach(async () => {

    });

    after(async () => {
        // run a single time after tests
    });

});
