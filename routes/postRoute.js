const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middleware/authMiddleware');
const { 
  allowTo
} = require('../controller/userController');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleWare');

const {
  getSpecificDocValidator
} = require('../utils/validators/postValidator')

const {
  addPost,
  getAllPosts,
  updatePost,
  getSpecificPost,
  deleteSpecificPost,
  getAllLikes,
  addLike,
  deleteLike
} = require('../controller/postController')

const {
  addCommentValidator,
  getSpecificCommentIdValidator,
} = require('../utils/validators/commentValidator')

const {
  addCommentToPost,
  getAllComment,
  updateComment,
  deleteComment
} = require('../controller/commentController')

router.route('/')
  .post(authMiddleWare, allowTo('user'), uploadSingleImage('image', 'Post'), addPost)
  .get(authMiddleWare, getAllPosts)



router.route('/:id')
  .patch(authMiddleWare, getSpecificDocValidator, allowTo('user'), uploadSingleImage('image', 'Post'), updatePost)
  .get(authMiddleWare, getSpecificDocValidator, getSpecificPost)
  .delete(authMiddleWare, getSpecificDocValidator, deleteSpecificPost)
  
router.route('/:id/likes')
  .get(authMiddleWare, getSpecificDocValidator, getAllLikes)
  .post(authMiddleWare, allowTo('user'), getSpecificDocValidator, addLike)
  .delete(authMiddleWare, allowTo('user'), getSpecificDocValidator,deleteLike)

router.route('/:id/comments')
  .get(authMiddleWare, getSpecificDocValidator, getAllComment)
  .post(authMiddleWare, allowTo('user'), getSpecificDocValidator, addCommentValidator, addCommentToPost);
router.route('/:id/comments/:commentId')
  .patch(authMiddleWare, allowTo('user'), getSpecificDocValidator,getSpecificCommentIdValidator,updateComment)
  .delete(authMiddleWare, getSpecificDocValidator,getSpecificCommentIdValidator,deleteComment)

module.exports = router;