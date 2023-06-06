const Sequelize = require('sequelize');

const models = {

    control(sequelize) {
        const Control = sequelize.define('control', {
            price: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            bill: {
                type: Sequelize.STRING(64)
            },
            category: {
                type: Sequelize.STRING(96),
                allowNull: false
            }
        })

        return Control;

    },
    payment(sequelize) {
        const Payment = sequelize.define('payment', {
            payment: {
                type: Sequelize.STRING(96),
                allowNull: false
            },
        })

        return Payment

    },
    controlType(sequelize) {
        const ControlType = sequelize.define('controlType', {
            status: {
                type: Sequelize.STRING(128),
                allowNull: false
            }
        })
        return ControlType
    }
}

module.exports = models;


//trazer payments nas rotas de controls
