const { db } = require("../database/api");

class ExpenseControl {

    async getBills(req, res) {
        try {
            const control = await db.Control.findAll({
                include: [{
                    model: db.Payment
                },
                {
                    model: db.ControlType
                }
            ],
            })
            return res.json(control)
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    };

    async createNewBill(req, res) {
        try {
            const { price, bill, category } = req.body;
            if (typeof price !== "number") {
                return res.status(400).json({ message: "Parâmetro inválido" })
            }

            const control = await db.Control.create({ price, bill, category })

            return res.status(201).json(control)

        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    };

    async updateBill(req, res) {
        try {
            const { price, bill, category } = req.body;
            const billControl = await db.Control.findOne({ where: { id: req.params.id } })

            if (!billControl) {
                return res.status(404).json({ message: "Gasto não existe" })
            }

            billControl.price = price;
            billControl.bill = bill;
            billControl.category = category;

            await billControl.save();

            return res.status(200).json(billControl)
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    }

    async deleteBill(req, res) {
        try {
            const billControl = await db.Control.findOne({ where: { id: req.params.id } })

            await billControl.destroy();

            return res.status(200).json({ message: "Gasto deletado :)" })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    }
};

const expenseControl = new ExpenseControl();

module.exports = expenseControl;

