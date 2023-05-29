const { db } = require("../database/api");

class ExpenseControl {

    async getBills(req, res) {
        try {
            await db.Control.findAll().then((control) => {
                if (control) {
                    return res.json(control);
                }
                res.status(404).json({ message: "Nenhum gasto foi encontrado" });
            });
        } catch (err) {
            console.log(err)
        }
    };

    async createNewBill(req, res) {
        try {
            const { price, bill, category } = req.body;
            //    const newCategory = await db.Control.findOne({where: {category}});

            //     if(newCategory.upperCase() === req.body.category.upperCase()) {
            //         req.body.category = newCategory;
            //     };

            await db.Control.create({ price, bill, category }).then((control) => {
                res.json(control)
            });

            return res.status(200).json({ message: "Gasto criado" })
        } catch (err) {
            console.log(err)
        }
    };

    async updateBill(req, res) {
        try {
            const { price, bill, category } = req.body;
            const billControl = await db.Control.findOne({ where: { id: req.params.id } })

            if (!billControl) {
                return res.status(404).json({ message: "Gasto não existe" })
            }

            await billControl.update(
                {
                    price: price,
                    bill: bill,
                    category: category,
                })

            return res.status(200).json({ message: "Gasto atualizado" })
        } catch (err) {
            console.log(err)
        }
    }

    async deleteBill(req, res) {
        try {
            const billControl = await db.Control.destroy({ where: { id: req.params.id } })
            return res.status(200).json({ message: "Gasto deletado :)" })
        } catch (err) {
            console.log(err)
        }
    }
};

const expenseControl = new ExpenseControl();

module.exports = expenseControl;

