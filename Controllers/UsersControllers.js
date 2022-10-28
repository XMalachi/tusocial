import express from "express"
import { Sequelize } from "sequelize"
import sequelizeConnection  from "../src/database/connection.js"
import userModel from '../models/user.cjs'
import postModel from '../models/post.cjs'
import likesModel from '../models/likes.cjs'
import followersModel from '../models/followers.cjs'
import jwt from "jsonwebtoken"
import generateToken from "../utils/generateToken.js"


sequelizeConnection.authenticate().then(()=> {
    console.log('Connected')
}).catch((err)=>{
    console.log("authentication error",err)
})

// sequelizeConnection.sync({alter: true})

const models = {
    User: userModel(sequelizeConnection, Sequelize.DataTypes),
    Post: postModel(sequelizeConnection, Sequelize.DataTypes),
   Likes: likesModel(sequelizeConnection, Sequelize.DataTypes),
   Followers: followersModel(sequelizeConnection, Sequelize.DataTypes),

    
}
models.User.hasMany(models.Post)
models.Post.belongsTo(models.User)

models.Post.hasMany(models.Likes)
models.Likes.belongsTo(models.Post)

models.User.hasMany(models.Followers)
models.Followers.belongsTo(models.User)


// users regiostration  endpoint
const registerUser = async(req, res) => {
    const { name, email, password, address, interest, status} = req.body
    try {
        const userExists = await models.User.findOne({ where: {email}}).catch(err => {
            if(err) console.log( "Error : ", err)
        })

        if(userExists){
            return res.status(400).json({
                status: 'failed',
                error: "User with this email already exists"
            })
        }
        let createUser = await models.User.create({
            name,
            email,
            password,
            address,
            interest,
            status
        })
        
        res.status(200).json({
            status: 'good',
            user: createUser
        })
    } catch (error) {
        res.status(400).json({
            status: 'bad',
            error: error
        })
    }
}

const loginUser = async(req, res) => {
    const {email, password} = req.body

    try {
        const user = await models.User.findOne({where: {email}}).catch(err => {
            if(err) console.log(err)
        })

        if(user.password !== password){
            return res.status(400).json({
                status: 'bad',
                error: "Email and Password does not match"
            })
        }

        const jwttoken = jwt.sign({
            id: user.id, email: user.email
        }, process.env.JWTSECRET, {expiresIn:'2hrs'})

        if(user.password === password){
            res.status(201).json({
                status:'success',
                user:{
                    jwttoken
                }
            })
        }else{
            res.status(402)
            throw new Error('incorrect Email or password')
        }

    } catch (error) {
        res.status(400).json({
            status: 'Login Failed',
            error: "Please provide valid email and password"
        })
    }
}


// get all users endpoint 
const getAllUsers = async(req, res) => {
    try{
        let getUser = await models.User.findAll({
            include: [{
                model: models.Post 
            }
        ]
        })
        res.status(200).json({
            status: 'Success',
            getUser
        })
    }catch(err){
        res.status(400).json({
            status: 'Get all users Failed',
            error: err
        })
    }
    
}


// get single user endpoint

const getSingleUser = async(req, res) => {
    const {id} = req.params
    try{
        let getUser = await models.User.findByPk(id, {
            include: [{
                model: models.Post 
            }]
        })
        res.status(200).json({
            status: 'Success',
            getUser
        })
    }catch(err){
        res.status(400).json({
            status: 'Login Failed',
            error: err
        })
    }
    
}


// follow  user route 

const followUser = async(req, res) => {
    const {id} = req.params
    try{
        let getUser = await models.User.findByPk(id, {
            include: [{
                model: models.Post 
            }]
        })
        res.status(200).json({
            status: 'Success',
            getUser
        })
    }catch(err){
        res.status(400).json({
            status: 'Login Failed',
            error: err
        })
    }
    
}

// unfollow  user endpoint 

const unfollowUser =  async(req, res)  => {
    const {followerId, mainUserId} =  req.body
    try{
        let unfollowUser = await models.Followers.destroy({
            where: { followerId:followerId,  mainUserId: mainUserId},
        })
        res.status(200).json({
            status: `You just unfolowed post with id ${mainUserId} `,
            unfollowUser
        })
    }catch(err){
        res.status(400).json({
            status: 'Failed',
            error: "Failed to unlike post"
        })
    }
    
}

export {
    registerUser,
    loginUser,
    getAllUsers,
    getSingleUser,
    followUser,
    unfollowUser
}
