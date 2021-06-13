const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'How840925', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;