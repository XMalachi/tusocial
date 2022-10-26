import JWT from "jsonwebtoken";
import User from "../models/UserModel.js";

const protect = async (req,res,next)=> {
    console.log("The request header",req.headers.authorization)
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        token = req.headers.authorization.split(' ')[1];

        try{
            const decoded = await JWT.verify(token, process.env.JWTSECRET)
            console.log('decoded',decoded.id)
            const user = await User.findById(decoded.id).select("-password")
            console.log(user)
            req.user = user;
            next()
        }catch(err){
            console.log(err)
            res.status(401).json({
                status:'failed',
                error:'Invalid token, Not authorized!'
            })
        }
       
    }

    if(!token){
        res.status(401).json({
            status:'failed',
            error:'No token, Not authorized!'
        })
    }
}

export {protect}