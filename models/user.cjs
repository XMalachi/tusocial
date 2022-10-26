'use strict';
const {
  Model
} = require('sequelize');
// import crypt from 'bcrypt'
// import postModel from 'post.cjs'

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here\

      User.hasMany(models.Post, { foreignKey: 'userId' });
      console.log('models from user', models)
    }
  }
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email:{
      allowNull: false,
      type: DataTypes.STRING
    },
    password:{
      allowNull: false,
      type: DataTypes.STRING
    },
    address: DataTypes.STRING,
    interest: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = models => {
    User.hasMany(models.Post, {foreignKey: 'userId'})
    User.belongsToMany(models.Post)
  }


  return User;
};