const multer = require('multer');

const Post = require('../models/Post'); 

class PostController{
    async index(request, response) {
        const posts = await Post.find();
    
        return response.json(posts);
    }

    async show(request, response) {
        const { id } = request.params;
        const post = await Post.findById(id);
    
        if(!post)
            return response.status(404).json({error: 'Post não existe'});
    
        return response.json(post);
    }

    async store(request, response)  {
        const { originalname : name, size, key, location: url = '' } = request.file;
    
        const newPost = await Post.create({
            name,
            size,
            key,
            url
        });
    
        return response.status(201).json(newPost);
    }

    async delete(request, response) {
        const { id } = request.params;
        const post = await Post.findById(id);
    
        if(!post)
            return response.status(404).json({error: 'Post not found'});
    
        await post.remove();
    
        return response.send();
    }
}

module.exports = new PostController();