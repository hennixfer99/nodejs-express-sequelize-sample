const Sequelize = require('sequelize');
const models = require('../models/expenseControl.models');

const sequelize = new Sequelize('nodejs_express_sequelize_sample', 'root', 'root', {
    host:'localhost',
    dialect: 'mysql',
});

const db = {
    Control: models.control(sequelize),
};

module.exports = {db, sequelize}

// module.exports = {
//     up(queryInterface, Sequelize) {
//         return queryInterface.createTable('expense-control', {
//             id:{
//                 type: Sequelize.INTEGER,
//                 primaryKey: true,
//                 autoIncrement: true,
//             },
//             price:{
//                 type: Sequelize.NUMBER
//             },
//             bill:{
//                 type: Sequelize.STRING
//             },
//             category: {
//                 type: Sequelize.STRING
//             },

//             createdAt: Sequelize.DATE,
//             updatedAt: Sequelize.DATE,
//         })
//     },
//     down(queryInterface, Sequelize) {
//         return queryInterface.dropTable('expense-control');
//     },
// }
