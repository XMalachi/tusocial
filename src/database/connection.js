import Sequelize from 'sequelize'

const sequelizeConnection = new Sequelize('tusocial', 'root', '', {host: 'localhost', dialect: 'mysql', operatorAliases: false});

export default sequelizeConnection;

global.sequelize = sequelizeConnection