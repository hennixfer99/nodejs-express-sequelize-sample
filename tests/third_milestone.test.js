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

    it('test create payment route', async () => {

        const resBill = await agent.post('/expense-controll/').send({
            price: 35,
            bill: "testinho",
            category: "teste",
        })

        const resPayment = await agent.post('/expense-controll/payment').send({
            payment: "cartão de crédito",
            controlId: resBill.body.id
        })

        expect(resPayment.statusCode).to.be.equals(201);
        expect(resPayment.body.payment).to.be.equals("cartão de crédito");
        expect(resPayment.body.controlId).to.be.equals(resBill.body.id);

        await agent.delete(`/expense-controll/payment/${resPayment.body.id}`);
        await agent.delete(`/expense-controll/${resBill.body.id}`)
    });

    it('test create payment route error without a bill or with a non valid bill', async () => {

        const resBill = await agent.post('/expense-controll/').send({
            price: 35,
            bill: "testinho",
            category: "teste",
        })

        const resPayment = await agent.post('/expense-controll/payment').send({
            payment: "cartão de crédito",
            controlId: "teste"
        })

        expect(resPayment.statusCode).to.be.equals(400);
        expect(resPayment.body).to.deep.equals({ message: "Parâmetro inválido" });

        const resPaymentWithoutABill = await agent.post('/expense-controll/payment').send({
            payment: "cartão de crédito"
        })

        expect(resPaymentWithoutABill.statusCode).to.be.equals(400);
        expect(resPaymentWithoutABill.body).to.deep.equals({ message: "Parâmetro inválido" });

        const resWithoutAPayment = await agent.post('/expense-controll/payment').send({
            controlId: resBill.body.id
        })

        expect(resWithoutAPayment.statusCode).to.be.equals(400);
        expect(resWithoutAPayment.body).to.deep.equals({ message: "Parâmetro inválido" });

        const resPaymentWithAWrongId = await agent.post('/expense-controll/payment').send({
            payment: "cartão de crédito",
            controlId: -1
        })

        expect(resPaymentWithAWrongId.statusCode).to.be.equals(400);
        expect(resPaymentWithAWrongId.body).to.deep.equals({ message: "Você precisa de uma conta para um pagamento" });

        await agent.delete(`/expense-controll/${resBill.body.id}`)
    });

    it('test get payment route', async () => {

        const resBill = await agent.post('/expense-controll/').send({
            price: 35,
            bill: "testinho",
            category: "teste",
        })

        expect(resBill.statusCode).to.be.equals(201);

        const resPayment = await agent.post('/expense-controll/payment').send({
            payment: "cartão de crédito",
            controlId: resBill.body.id
        });

        expect(resPayment.statusCode).to.be.equals(201);

        const resGet = await agent.get('/expense-controll/payment');

        expect(resGet.statusCode).to.be.equals(200);
        expect(resGet.body.length).to.be.equals(1);

        const resGetBillWithPayments = await agent.get('/expense-controll')

        expect(resGetBillWithPayments.statusCode).to.be.equals(200);
        expect(resGetBillWithPayments.body[0].payments.length).to.be.equals(1);

        const retrievedType = resGet.body[0];

        expect(retrievedType.payment).to.be.equals('cartão de crédito');

        await agent.delete(`/expense-controll/payment/${retrievedType.id}`);
        await agent.delete(`/expense-controll/${resBill.body.id}`)

        const resGetAfterDelete = await agent.get('/expense-controll/payment');

        expect(resGetAfterDelete.statusCode).to.be.equals(200);
        expect(resGetAfterDelete.body).to.deep.equal([]);
    });

    it('test a get payments in a control route', async () => {
        const resBill = await agent.post('/expense-controll/').send({
            price: 35,
            bill: "testinho",
            category: "teste",
        })

        expect(resBill.statusCode).to.be.equals(201);

        const resPayment = await agent.post('/expense-controll/payment').send({
            payment: "cartão de crédito",
            controlId: resBill.body.id
        });

        expect(resPayment.statusCode).to.be.equals(201);

        const resPayment2 = await agent.post('/expense-controll/payment').send({
            payment: "cartão de crédito",
            controlId: resBill.body.id
        });

        expect(resPayment2.statusCode).to.be.equals(201);

        const resPayment3 = await agent.post('/expense-controll/payment').send({
            payment: "cartão de crédito",
            controlId: resBill.body.id
        });

        expect(resPayment3.statusCode).to.be.equals(201);

        const resPayment4 = await agent.post('/expense-controll/payment').send({
            payment: "cartão de crédito",
            controlId: resBill.body.id
        });

        expect(resPayment4.statusCode).to.be.equals(201);

        const resGet = await agent.get(`/expense-controll/${resBill.body.id}/payment`);

        expect(resGet.statusCode).to.be.equals(200);
        expect(resGet.body.length).to.be.equals(4);

        const resDelete = await agent.delete(`/expense-controll/payment/${resPayment.body.id}`);

        expect(resDelete.statusCode).to.be.equals(200);

        const resDelete2 = await agent.delete(`/expense-controll/payment/${resPayment2.body.id}`);

        expect(resDelete2.statusCode).to.be.equals(200);

        const resDelete3 = await agent.delete(`/expense-controll/payment/${resPayment3.body.id}`);

        expect(resDelete3.statusCode).to.be.equals(200);

        const resDelete4 = await agent.delete(`/expense-controll/payment/${resPayment4.body.id}`);

        expect(resDelete4.statusCode).to.be.equals(200);

        const resGetAfterDelete = await agent.get(`/expense-controll/${resBill.body.id}/payment`);

        expect(resGetAfterDelete.statusCode).to.be.equals(200);
        expect(resGetAfterDelete.body).to.deep.equal([]);

        const billDelete =  await agent.delete(`/expense-controll/${resBill.body.id}`)

        expect(billDelete.statusCode).to.be.equals(200);

    });

    it('test get types in control error route', async() => {
        const resGet = await agent.get(`/expense-controll/-1/payment`);

        expect(resGet.statusCode).to.be.equals(400);
        expect(resGet.body).to.deep.equals({ message: "Você precisa de uma conta para visualizar pagamento" });
    })

    it('test update payment route', async () => {

        const resBill = await agent.post('/expense-controll/').send({
            price: 35,
            bill: "testinho",
            category: "teste",
        })

        expect(resBill.statusCode).to.be.equals(201);

        const resPost = await agent.post('/expense-controll/payment').send({
            payment: "cartão de crédito",
            controlId: resBill.body.id
        });

        expect(resPost.statusCode).to.be.equals(201);

        const resUpdate = await agent.put(`/expense-controll/payment/${resPost.body.id}`).send({
            payment: "teste"
        });
        expect(resUpdate.statusCode).to.be.equals(200);
        expect(resUpdate.body.payment).to.be.equals('teste');

        await agent.delete(`/expense-controll/payment/${resPost.body.id}`);
        await agent.delete(`/expense-controll/${resBill.body.id}`)

        const resGetAfterDelete = await agent.get('/expense-controll/payment');

        expect(resGetAfterDelete.statusCode).to.be.equals(200);
        expect(resGetAfterDelete.body).to.deep.equal([]);
    });

    it('test update payment error route', async () => {
        const resUpdate = await agent.put(`/expense-controll/payment/-1`).send({
            payment: "claudio"
        });
        expect(resUpdate.statusCode).to.be.equals(404);
        expect(resUpdate.body).to.deep.equals({ message: "Pagamento não existe" });
    })

    it('test delete payment route', async () => {

        const resBill = await agent.post('/expense-controll/').send({
            price: 35,
            bill: "testinho",
            category: "teste",
        })

        expect(resBill.statusCode).to.be.equals(201);

        const resPost = await agent.post('/expense-controll/payment').send({
            payment: "cartão de crédito",
            controlId: resBill.body.id
        });

        expect(resPost.statusCode).to.be.equals(201);

        const resDelete = await agent.delete(`/expense-controll/payment/${resPost.body.id}`);
        await agent.delete(`/expense-controll/${resBill.body.id}`)

        expect(resDelete.statusCode).to.be.equals(200);
        expect(resDelete.body).to.deep.equals({ message: "Método de pagamento deletado :)" });
    });


    afterEach(async () => {
    });

    after(async () => {
        // run a single time after tests
    });

});
