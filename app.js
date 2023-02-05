const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const router = require('./routes/index');


// middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'));
app.use(cors());


// routes middlewares
app.use('/api', router);


module.exports = app;