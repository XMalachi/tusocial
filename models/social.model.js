import { sequelize, DataTypes } from 'sequelize';

const User = sequelize.define(
    "user",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        address: {
            type: DataTypes.STRING,
            allowNull: false, 
        },

        interest: {
            type: DataTypes.STRING,
            allowNull: false, 
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false, 
            default: 'active'
        }


    }
)

sequelize.sync().then(()=>{
    console.log('User Table created')
}).catch((err)=>{
    console.log(err)
})