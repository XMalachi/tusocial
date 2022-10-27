import dotenv from 'dotenv'
dotenv.config();
import express from "express"
import cors from "cors"
import morgan from "morgan"
import colors from 'colors'
import { Sequelize } from "sequelize"
import sequelizeConnection  from "./src/database/connection.js"
import userModel from './models/user.cjs'
import postModel from './models/post.cjs'
import likesModel from './models/likes.cjs'
import followersModel from './models/followers.cjs'
import jwt from "jsonwebtoken"
import generateToken from "./utils/generateToken.js"
// import { db } from "./config/db.js"
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json({limit: '50mb'}))


const port = process.env.NODE_ENV ? process.env.PORT : 5000



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

// test server
app.get('/', (req, res)=> {
    let message = "Welcome to backend"
    res.json({
        status: 'good',
        msg: message
    })
})

// register
app.post('/api/v1/create-user', async (req, res)=> {
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
            error: "Registration Failed"
        })
    }  
})

// login user
app.post('/api/v1/login', async (req, res)=> {
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
        }, process.env.JWTSECRET)

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
})

// get all user request

app.get('/api/v1/get-allusers', async (req, res)=> {
    // const {id} = req.params
    try{
        let getUser = await models.User.findAll({
            include: [{
                model: models.Post 
            },
            {
                model: models.Followers
            }
        ]
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
    
})

// get single user

app.get('/api/v1/get-singleuser/:id', async (req, res)=> {
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
    
})


// follow user
app.post('/api/v1/follow-user/:id', async (req, res)=> {
    const {followerId, mainUserId} =  req.body
    const {id} = req.params
    try{
        let followedUser = await models.Followers.create({
            mainUserId: mainUserId,
            followerId: followerId
        })
        res.status(200).json({
            status: `You just followed post with id ${mainUserId}`,
            followedUser
        })
    }catch(err){
        res.status(400).json({
            status: 'Failed',
            error: "Failed to like post"
        })
    }
    
})


//  unfollow user
app.post('/api/v1/unfollow-user', async (req, res)=> {
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
    
})





// create post 
app.post('/api/v1/create-post', async (req, res)=> {
    try {
        let createPost = await models.Post.create({
            title: 'Hello',
            description: 'Hiiii@gmail.com',
            userId: 1,
        })
        res.status(200).json({
            status: 'Success',
            createPost
        })
    } catch (error) {
        console.log(error) 
    } 

})

// get all posts

app.get('/api/v1/get-allposts', async (req, res)=> {
    // const {id} = req.params
    try{
        let getUser = await models.User.findAll()
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
    
})


// get single post 

app.get('/api/v1/get-post/:id', async (req, res)=> {
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
    
})

// like a post 

app.post('/api/v1/like-post/', async (req, res)=> {
    const {postid, userid} =  req.body
    console.log(req.body, "req.query from likes")
    try{
        let likedPost = await models.Likes.create({
            postId: postid,
            userId: userid
        })
        res.status(200).json({
            status: `You just liked post with id ${postid} `,
            likedPost
        })
    }catch(err){
        res.status(400).json({
            status: 'Failed',
            error: "Failed to like post"
        })
    }
    
})

// unlike post

app.post('/api/v1/unlike-post/', async (req, res)=> {
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
    
})

// update post

app.put('/api/v1/update-post/:id', async (req, res)=> {
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
    
})


// hide post
app.put('/api/v1/hide-post/:id', async (req, res)=> {
    // const {isHidden} =  req.body
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
    
})



// unhide post

app.put('/api/v1/unhide-post/:id', async (req, res)=> {
    // const {isHidden} =  req.body
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
    
})

// delete post
app.delete('/api/v1/delete-post/:id', async (req, res)=> {
    const {id} = req.params
    try {

        let deletePost = await models.Post.findByPk(id)

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

})


app.listen(port, (err)=>{
    if(err){
        throw err
    }
    console.log('server connected'.bgCyan)
})