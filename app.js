const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const Book = require('./models/bookModel');
const bookRouter = require('./routes/bookRouter')(Book);

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

if (process.env.ENV === 'Test') {
  mongoose.connect('mongodb://localhost/bookAPI_Test');
} else {
  mongoose.connect('mongodb://localhost/bookAPI');
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.server = app.listen(port, () => {
  console.log(`Running port ${port}`);
});

module.exports = app;
