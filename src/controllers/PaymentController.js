const { db } = require("../database/api");

class PaymentController {

    async getPayments(req, res) {
        try {
            const payment = await db.Payment.findAll()
            return res.json(payment)
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    };

    async getPaymentInControlId(req, res) {
        try {
            const billExists = await db.Control.findOne({ where: { id: req.params.id } });
            if(!billExists){
                return res.status(400).json({ message: "Você precisa de uma conta para visualizar pagamento" })
            }
            const payments = await db.Payment.findAll()
            return res.json(payments)
        }catch(err){
            console.log(err)
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    }

    async createNewPayment(req, res) {
        try {
            const { payment, controlId } = req.body;

            const billExists = await db.Control.findOne({ where: { id: controlId } });

            if (typeof controlId !== 'number') {
                return res.status(400).json({ message: "Parâmetro inválido" })
            }
            if(!billExists) {
                return res.status(400).json({ message: "Você precisa de uma conta para um pagamento" })
            }
            if (payment) {
                const payments = await db.Payment.create({ payment, controlId })

                return res.status(201).json(payments)
            }

            return res.status(400).json({ message: "Parâmetro inválido" })

        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    };

    async updatePayment(req, res) {
        try {
            const { payment } = req.body;
            const billPayment = await db.Payment.findOne({ where: { id: req.params.id } })

            if (!billPayment) {
                return res.status(404).json({ message: "Pagamento não existe" })
            }

            billPayment.payment = payment;

            await billPayment.save();

            return res.status(200).json(billPayment)
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    }

    async deletePayment(req, res) {
        try {
            const billPayment = await db.Payment.findOne({ where: { id: req.params.id } })

            await billPayment.destroy();

            return res.status(200).json({ message: "Método de pagamento deletado :)" })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    }
};

const paymentController = new PaymentController();

module.exports = paymentController;

