import dotenv from 'dotenv'
dotenv.config();
import Sequelize from 'sequelize'


const sequelizeConnection = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {host: process.env.DB_HOST, dialect: 'mysql',operatorAliases: false,});
//const sequelize//Connection = new Sequelize(process.env.DATABASE, 'root', '', {host: 'localhost', dialect: 'mysql', operatorAliases: false});
 console.log(process.env.DB_USERNAME, 'username')
 console.log(process.env.DB_DATABASE, 'database')
export default sequelizeConnection;

global.sequelize = sequelizeConnection