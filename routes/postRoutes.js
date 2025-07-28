const express = require('express');
const router = express.Router();
const {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    getPostById
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Public route to get all posts
router.get('/', getPosts);

// Public route to get a single post by its ID
router.get('/:id', getPostById);

// Protected route to create a new post
router.post('/', protect, createPost);

// Protected routes to update or delete a post
router.route('/:id').put(protect, updatePost).delete(protect, deletePost);

module.exports = router;