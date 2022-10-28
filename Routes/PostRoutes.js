import express from "express";

const router = express.Router()
import { 
    createPost,
    getAllPost,
    getSinglePost,
    updatePost,
    likePost,
    unLikePost,
    hidePost,
    unhidePost,
    deletePost 
} from "../Controllers/PostControllers.js";


router.route('/create-post').post(createPost)
router.route('/get-allposts').get(getAllPost)
router.route('/get-post/:id').get(getSinglePost)
router.route('/like-post').post(likePost)
router.route('/unlike-post').post(unLikePost)
router.route('/update-post/:id').post(updatePost)
router.route('/hide-post/:id').post(hidePost)
router.route('/unhide-post/:id').post(unhidePost)
router.route('/delete-post/:id').delete(deletePost)

export default router