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

    it('test create status route', async () => {

        const resStatus = await agent.post(`/control-type`).send({
            status: "Ronaldo",
        })

        expect(resStatus.statusCode).to.be.equals(201);
        expect(resStatus.body.status).to.be.equal("Ronaldo");

        const resDelete = await agent.delete(`/control-type/${resStatus.body.id}`);

        expect(resDelete.statusCode).to.be.equals(200);
    });

    it('test create status route error without a status', async () => {

        const resStatus = await agent.post(`/expense-controll`).send({
        })
        expect(resStatus.statusCode).to.be.equals(400);
        expect(resStatus.body).to.deep.equals({ message: "Parâmetro inválido" });
    });

    it('test get status route', async () => {

        const resStatus = await agent.post(`/control-type`).send({
            status: "claudio"
        });

        expect(resStatus.statusCode).to.be.equals(201);

        const resGet = await agent.get(`/control-type`);

        expect(resGet.statusCode).to.be.equals(200);
        expect(resGet.body.length).to.be.equals(1);

        const resGetOne = await agent.get(`/control-type/${resStatus.body.id}`);

        expect(resGetOne.statusCode).to.be.equals(200);
        expect(resGetOne.body.status).to.be.equals("claudio");

        await agent.delete(`/control-type/${resStatus.body.id}`);

        const resNewGet = await agent.get(`/control-type`);

        expect(resNewGet.statusCode).to.be.equals(200);
        expect(resNewGet.body).to.deep.equal([]);
    });

    it('test a get status with wrong id', async () => {
        const resGetOne = await agent.get(`/control-type/-1`);

        expect(resGetOne.statusCode).to.be.equals(400);
        expect(resGetOne.body).to.deep.equals({ message: "pagamento não existe" });
    });

    it('test update status error route', async () => {

        const resStatus = await agent.post(`/control-type`).send({
            status: "Romário"
        });

        expect(resStatus.statusCode).to.be.equals(201);

        const resStatusUpdated = await agent.put(`/control-type/${resStatus.body.id}`).send({
            status: "Cleiton"
        });

        expect(resStatusUpdated.body.status).to.be.equals("Cleiton")

        const billDelete = await agent.delete(`/control-type/${resStatus.body.id}`)

        expect(billDelete.statusCode).to.be.equals(200);
    })

    it('test update status route', async () => {
        const resStatusInvalid = await agent.put(`/control-type/-1}`).send({
            status: "Cleiton"
        });

        expect(resStatusInvalid.statusCode).to.be.equals(404);
        expect(resStatusInvalid.body).to.deep.equals({ message: "status não existe" });
    });

    it('test delete status route', async () => {

        const resStatus = await agent.post(`/control-type`).send({
            status: "Pao com mortadela"
        });

        expect(resStatus.statusCode).to.be.equals(201);

        const resDelete = await agent.delete(`/control-type/${resStatus.body.id}`);

        expect(resDelete.statusCode).to.be.equals(200);
        expect(resDelete.body).to.deep.equals({ message: "Status de pagamento deletado :)" });
    });

    it('test delete status error route', async () => {

        const resStatus = await agent.delete(`/control-type/-1`)

        expect(resStatus.statusCode).to.be.equals(404);
        expect(resStatus.body).to.deep.equals({ message: "status não existe" });
    });

    it('test associate controlType with control', async () => {
        const resStatus = await agent.post(`/control-type`).send({
            status: "Pao com mortadela"
        });

        expect(resStatus.statusCode).to.be.equals(201)

        const resBill = await agent.post('/expense-controll').send({
            price: 35,
            bill: "testinho",
            category: "teste",
        })

        expect(resBill.statusCode).to.be.equals(201)

        const controlTypeAssociation = await agent.post(`/control-type/${resStatus.body.id}/expense-controll`).send({
            id: resBill.body.id
        })

        expect(controlTypeAssociation.statusCode).to.be.equals(200);

        const billDelete = await agent.delete(`/expense-controll/${resBill.body.id}`)

        expect(billDelete.statusCode).to.be.equals(200);

        const statusDelete = await agent.delete(`/control-type/${resStatus.body.id}`)

        expect(statusDelete.statusCode).to.be.equals(200);

    })

    it('test associate controlType with control error route', async () =>{
        const controlTypeAssociationerror = await agent.post(`/control-type/-1/expense-controll`).send({
            id: 1
        })
        expect(controlTypeAssociationerror.statusCode).to.be.equals(404)

        const resStatus = await agent.post(`/control-type`).send({
            status: "Pao com mortadela"
        });

        const controlTypeAssociationerror2 = await agent.post(`/control-type/${resStatus.body.id}/expense-controll`).send({
            id: -1
        })
        expect(controlTypeAssociationerror2.statusCode).to.be.equals(404)

        const statusDelete = await agent.delete(`/control-type/${resStatus.body.id}`)

        expect(statusDelete.statusCode).to.be.equals(200);

    })

    it('test associate control with controlType', async () => {

        const resStatus = await agent.post(`/control-type`).send({
            status: "Pao com mortadela"
        });

        expect(resStatus.statusCode).to.be.equals(201)

        const resBill = await agent.post('/expense-controll/').send({
            price: 35,
            bill: "testinho",
            category: "teste",
        })

        expect(resBill.statusCode).to.be.equals(201)

        const controlAssociation = await agent.post(`/expense-controll/${resBill.body.id}/control-type`).send({
            id: resStatus.body.id
        })

        expect(controlAssociation.statusCode).to.be.equals(200);

        expect(controlAssociation.statusCode).to.be.equals(200);

        const billDelete = await agent.delete(`/expense-controll/${resBill.body.id}`)

        expect(billDelete.statusCode).to.be.equals(200);

        const statusDelete = await agent.delete(`/control-type/${resStatus.body.id}`)

        expect(statusDelete.statusCode).to.be.equals(200);

    })

    it('test associate control with controlType error route', async () =>{

        const controlAssociationerror = await agent.post(`/expense-controll/-1/control-type`).send({
            id: resStatus.body.id
        })

        expect(controlAssociationerror.statusCode).to.be.equals(404);

        const resBill = await agent.post('/expense-controll').send({
            price: 35,
            bill: "testinho",
            category: "teste",
        })

        expect(resBill.statusCode).to.be.equals(201)

        const controlAssociationerror2 = await agent.post(`/expense-controll/${resBill.body.id}/control-type`).send({
            id: -1
        })

        expect(controlAssociationerror2.statusCode).to.be.equals(404);
    })

    it('test dissociate controlType with control', async () => {
        const resStatus = await agent.post(`/control-type`).send({
            status: "Pao com mortadela"
        });

        expect(resStatus.statusCode).to.be.equals(201)

        const resBill = await agent.post('/expense-controll/').send({
            price: 35,
            bill: "testinho",
            category: "teste",
        })

        expect(resBill.statusCode).to.be.equals(201)

        const controlTypeAssociation = await agent.post(`/control-type/${resStatus.body.id}/expense-controll`).send({
            id: resBill.body.id
        })

        expect(controlTypeAssociation.statusCode).to.be.equals(200);

        const controlTypeDissociation = await agent.delete(`/control-type/${resStatus.body.id}/expense-controll`).send({
            id: resBill.body.id
        })

        expect(controlTypeDissociation.statusCode).to.be.equals(200);

        const billDelete = await agent.delete(`/expense-controll/${resBill.body.id}`)

        expect(billDelete.statusCode).to.be.equals(200);

        const statusDelete = await agent.delete(`/control-type/${resStatus.body.id}`)

        expect(statusDelete.statusCode).to.be.equals(200);

    })

    it('test dissociate controlType with control error route', async () =>{

        const controlTypeAssociationerror = await agent.delete(`/control-type/-1/expense-controll`).send({
            id: 1
        })
        expect(controlTypeAssociationerror.statusCode).to.be.equals(404)

        const resStatus = await agent.post(`/control-type`).send({
            status: "Pao com mortadela"
        });

        const controlTypeAssociationerror2 = await agent.delete(`/control-type/${resStatus.body.id}/expense-controll`).send({
            id: -1
        })
        expect(controlTypeAssociationerror2.statusCode).to.be.equals(404)

        const statusDelete = await agent.delete(`/control-type/${resStatus.body.id}`)

        expect(statusDelete.statusCode).to.be.equals(200);

    })

    it('test dissociate control with controlType', async () => {
        const resStatus = await agent.post(`/control-type`).send({
            status: "Pao com mortadela"
        });

        expect(resStatus.statusCode).to.be.equals(201)

        const resBill = await agent.post('/expense-controll/').send({
            price: 35,
            bill: "testinho",
            category: "teste",
        })

        expect(resBill.statusCode).to.be.equals(201)

        const controlAssociation = await agent.post(`/expense-controll/${resBill.body.id}/control-type`).send({
            id: resStatus.body.id
        })

        expect(controlAssociation.statusCode).to.be.equals(200);

        const controlDissociation = await agent.delete(`/expense-controll/${resBill.body.id}/control-type`).send({
            id: resStatus.body.id
        })

        expect(controlDissociation.statusCode).to.be.equals(200);

        const billDelete = await agent.delete(`/expense-controll/${resBill.body.id}`)

        expect(billDelete.statusCode).to.be.equals(200);

        const statusDelete = await agent.delete(`/control-type/${resStatus.body.id}`)

        expect(statusDelete.statusCode).to.be.equals(200);
    })

    it('test dissociate control with controlType error route', async () =>{
        const controlAssociationerror = await agent.delete(`/expense-controll/-1/control-type`).send({
            id: resStatus.body.id
        })

        expect(controlAssociationerror.statusCode).to.be.equals(404);

        const resBill = await agent.delete('/expense-controll').send({
            price: 35,
            bill: "testinho",
            category: "teste",
        })

        expect(resBill.statusCode).to.be.equals(201)

        const controlAssociationerror2 = await agent.delete(`/expense-controll/${resBill.body.id}/control-type`).send({
            id: -1
        })

        expect(controlAssociationerror2.statusCode).to.be.equals(404);
    })

    afterEach(async () => {
    });

    after(async () => {
        // run a single time after tests
    });

});
