const path = require('path');
const bodyParser = require('body-parser');

const express = require('express');

const app = express();

const csvRouter = require('./routes/csv');
const chessRouter = require('./routes/chess');

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/chess', chessRouter);
app.use(csvRouter);

app.listen(3000);
