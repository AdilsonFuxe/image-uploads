const routes = require('express').Router();
const multerConfig = require('./config/multer');
const multer = require('multer');
const postController = require('./controllers/PostController');

routes.get('/posts', postController.index);
routes.get('/posts/:id', postController.show);
routes.post('/posts',multer(multerConfig).single('file') , postController.store);
routes.delete('/posts/:id', postController.delete);

module.exports = routes;