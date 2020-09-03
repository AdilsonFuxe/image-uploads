const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, '..', 'storage', 'uploads')));
app.use(morgan('dev'));
app.use(routes);


app.listen(process.env.PORT || 3333, ()=>{
    console.log('server listen on port .* 33333')
})