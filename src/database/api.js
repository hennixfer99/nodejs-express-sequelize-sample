const Sequelize = require('sequelize');
const models = require('../models/expenseControl.models');

const sequelize = new Sequelize('nodejs_express_sequelize_sample', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});

const db = {
    Control: models.control(sequelize),
    Payment: models.payment(sequelize),
    ControlType: models.controlType(sequelize)
};

db.Control.hasMany(db.Payment);
db.Payment.belongsTo(db.Control, {
    onDelete: 'cascade'
});

db.Control.belongsToMany(db.ControlType, {
    through: 'newTableControlType'
});
db.ControlType.belongsToMany(db.Control, {
    through: 'newTableControlType'
});

module.exports = { db, sequelize }

