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
}

module.exports = models;
