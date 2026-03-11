const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { getAllPosts, getPostById, createPost, getMyPosts, updatePost, deletePost } = require('../controllers/postController')

router.get('/', getAllPosts)
router.get('/:id', getPostById)
router.post('/', authMiddleware, createPost)
router.get('/user/me', authMiddleware, getMyPosts)
router.put('/:id', authMiddleware, updatePost)
router.delete('/:id', authMiddleware, deletePost)

module.exports = router
