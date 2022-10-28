import express from 'express'
import { 
    registerUser,
    loginUser,
    getAllUsers,
    getSingleUser,
    followUser,
    unfollowUser } from '../Controllers/UsersControllers.js'
const router = express.Router()

router.route('/create-user').post(registerUser)
router.route('/login').post(loginUser)
router.route('/get-allusers').get(getAllUsers)
router.route('/get-singleuser/:id').get(getSingleUser)
router.route('/follow-user').post(followUser)
router.route('/unfollow-user').post(unfollowUser)

export default router