const { db } = require("../database/api");

class ControlTypeController {

    async getStatus(req, res) {
        try {
            const controlType = await db.ControlType.findAll({
                include: [{
                    model: db.Control
                }
            ],
            })
            return res.json(controlType)
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    };

    async getStatusInControlId(req, res) {
        try {
            const controlType = await db.ControlType.findOne({ where: { id: req.params.id } });
            if (!controlType) {
                return res.status(400).json({ message: "pagamento não existe" })
            }
            return res.json(controlType)
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    }

    async createNewStatus(req, res) {
        try {
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: "Parâmetro inválido" })
            }

            const controlType = await db.ControlType.create({ status });
            return res.status(201).json(controlType);

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Ocorreu um erro no servidor", error: err });
          }
    };

    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const ControlTypeStatus = await db.ControlType.findOne({ where: { id: req.params.id } })

            if (!ControlTypeStatus) {
                return res.status(404).json({ message: "status não existe" })
            }

            ControlTypeStatus.status = status;

            await ControlTypeStatus.save();

            return res.status(200).json(ControlTypeStatus)
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    }

    async deleteStatus(req, res) {
        try {
            const billControlType = await db.ControlType.findOne({ where: { id: req.params.id } })

            if (!billControlType) {
                return res.status(404).json({ message: "status não existe" })
            }

            await billControlType.destroy();

            return res.status(200).json({ message: "Status de pagamento deletado :)" })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    }

    async controlTypeAssociation(req, res) {

        const {id} = req.body

        const controlType = await db.ControlType.findOne({ where: { id: req.params.id } });

        if(!controlType){
            return res.status(404)
        }

        const billExists = await db.Control.findOne({where: {id: id}});

        if(!billExists){
            return res.status(404)
        }

        const associationSuccess = await controlType.addControl(billExists);

        return res.status(200).json(associationSuccess);

    }

    async controlAssociation(req, res) {

        const {id} = req.body

        const billExists = await db.Control.findOne({where: {id: req.params.id}});

        if(!billExists){
            return res.status(404)
        }

        const controlType = await db.ControlType.findOne({ where: { id: id } });

        if(!controlType){
            return res.status(404)
        }

        const associationSuccess = await billExists.addControlType(controlType);

        return res.status(200).json(associationSuccess);

    }

    async controlTypeDissociation(req, res) {

        const {id} = req.body

        const controlType = await db.ControlType.findOne({ where: { id: req.params.id } });

        if(!controlType){
            return res.status(404)
        }

        const billExists = await db.Control.findOne({where: {id: id}});

        if(!billExists){
            return res.status(404)
        }

        const dissociationSuccess = await controlType.removeControl(billExists);

        return res.status(200).json(dissociationSuccess);

    }

    async controlDissociation(req, res) {

        const {id} = req.body

        const billExists = await db.Control.findOne({where: {id: req.params.id}});

        if(!billExists){
            return res.status(404)
        }

        const controlType = await db.ControlType.findOne({ where: { id: id } });

        if(!controlType){
            return res.status(404)
        }

        const dissociationSuccess = await billExists.removeControlType(controlType);

        return res.status(200).json(dissociationSuccess);

    }
    
};

const controlTypeController = new ControlTypeController();

module.exports = controlTypeController;
