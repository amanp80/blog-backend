const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, // This is a reference to a User document
        required: true,
        ref: 'User', // The model to use for the reference
    },
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
