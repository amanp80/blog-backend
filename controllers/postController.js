const Post = require('../models/postModel');

// @desc    Fetch all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
    try {
        // Fetch posts and populate author's name and id
        const posts = await Post.find({}).populate('author', 'name _id').sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name');
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Please add a title and content' });
    }

    try {
        const post = new Post({
            title,
            content,
            author: req.user._id, // Comes from the protect middleware
        });

        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
    const { title, content } = req.body;

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user trying to update is the author of the post
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        post.title = title || post.title;
        post.content = content || post.content;

        const updatedPost = await post.save();
        res.json(updatedPost);

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user trying to delete is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await post.deleteOne(); // Mongoose v6+ uses deleteOne()
        res.json({ message: 'Post removed' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
