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


// create post endpoint 

const createPost =  async(req, res) => {
    const {title, description, userId, thumbnail, isHidden, status } = req.body
    try {
        let createPost = await models.Post.create({
            title: title,
            description: description,
            userId: userId,
            thumbnail: thumbnail,
            isHidden: isHidden,
            status: status
        })
        res.status(200).json({
            status: 'Success',
            createPost
        })
    } catch (error) {
        console.log(error) 
    } 

}

// get all posts endpoint 

const getAllPost = async(req,res) => {
    try{
        let getPost = await models.Post.findAll()
        res.status(200).json({
            status: 'Success',
            getPost
        })
    }catch(err){
        res.status(400).json({
            status: 'Login Failed',
            error: err
        })
    }
    
}

// get single post endpoint

const getSinglePost = async(req, res) => {
    const {id} = req.params
    try{
        let getPost = await models.Post.findByPk(id, {
            include: [{
                model: models.Likes,
                
            }, {
                model: models.User,
            }]
        })
        res.status(200).json({
            status: 'success',
            getPost
        })
    }catch(err){
        res.status(400).json({
            status: ' Failed',
            error: err
        })
    }
    
}


// like  post endpoint 

const likePost = async(req, res) => {
    const {postId, userId} =  req.body
    try{
        let likedPost = await models.Likes.create({
            postId: postId,
            userId: userId
        })
        res.status(200).json({
            status: `You just liked post with id ${postId} `,
            likedPost
        })
    }catch(err){
        res.status(400).json({
            status: 'Failed',
            error: err
        })
    }
    
}

// unlike post endpoint

const unLikePost = async(req, res) => {
    const {postid, userid} =  req.body

    try{
        let unlikedPost = await models.Likes.destroy({
            where: { postId: postid, userId: userid },
        })
        res.status(200).json({
            status: `You just unliked post with id ${postid} `,
            unlikedPost
        })
    }catch(err){
        res.status(400).json({
            status: 'Failed',
            error: "Failed to unlike post"
        })
    }
    
}

// update post endpoint 

const updatePost = async(req, res) => {
    const {title, description, isHidden, status, thumbnail} =  req.body
    const {id} = req.params
    try{
        const updatePost = await models.Post.findByPk(id)


        if(title){
            updatePost.title = title
        }
        if(description){
            updatePost.description = description
        }

        if(isHidden){
            updatePost.isHidden = isHidden
        }

        if(status){
            updatePost.status = status
        }

        if(thumbnail){
            updatePost.thumbnail = thumbnail
        }

        const updatedPost = await updatePost.update(
            {
                title: title,
                description : description,
                isHidden : isHidden,
                status : status,
                thumbnail : thumbnail
            }
            
            );
        

        res.status(200).json({
            status: `You just updated post`,
            updatedPost
        })
    }catch(err){
        res.status(400).json({
            status: 'Failed',
            error: "Failed to update post"
        })
    }
    
}

// hide post 

const hidePost = async(req, res) => {
    const {id} = req.params
    try{
        const postToBeHidden = await models.Post.findByPk(id)

        if(postToBeHidden){
            postToBeHidden.isHidden = true
        }


        const hiddenPost = await postToBeHidden.update(
            { 
                postToBeHidden
            }
            
            );
        
        res.status(200).json({
            status: `You just hid this post`,
            hiddenPost
        })
    }catch(err){
        res.status(400).json({
            status: 'Failed',
            error: "Failed to hide post"
        })
    }
    
}

// unhide post endpoint

const unhidePost = async(req, res) => {
    const {id} = req.params
    try{
        const postToBeHidden = await models.Post.findByPk(id)

        if(postToBeHidden){
            postToBeHidden.isHidden = false
        }


        const hiddenPost = await postToBeHidden.update(
            { 
                postToBeHidden
            }
            
            );
        
        res.status(200).json({
            status: `You can now view this post`,
            hiddenPost
        })
    }catch(err){
        res.status(400).json({
            status: 'Failed',
            error: "Failed to hide post"
        })
    }
    
}

// delete post endpoint 

const deletePost = async(req, res) => {
    const {id} = req.params
    try {

        let deletePost = await models.Post.findByPk(id)

        if(!deletePost){
            throw new Error("Post not found")
        }

        let deletedPost = await deletePost.destroy()
        res.status(200).json({
            status: 'Deleted Successfully',
            deletedPost
        })
    } catch (error) {
        res.status(400).json({
            status: 'Failed to delete',
        })
    } 
}


export {
    createPost,
    getAllPost,
    getSinglePost,
    likePost,
    unLikePost,
    updatePost,
    hidePost,
    unhidePost,
    deletePost
}