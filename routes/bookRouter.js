const express = require('express');

function routes(Book) {
  const bookRouter = express.Router();

  bookRouter.route('/books')
    .get((req, res) => {
      const query = {};
      if (req.query.genre) {
        query.genre = req.query.genre;
      }
      Book.find(query, (err, books) => {
        if (err) {
          return res.send(err);
        }
        return res.json(books);
      });
    })
    .post((req, res) => {
      const book = new Book(req.body);
      book.save();

      return res.status(201)
        .json(book);
    });

  bookRouter.use('/books/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }

      if (!book) {
        return res.sendStatus(404);
      }

      req.book = book;

      return next();
    });
  });

  bookRouter.route('/books/:bookId')
    .get((req, res) => {
      const { book } = req;
      res.json(book);
    })
    .put((req, res) => {
      const { book } = req;
      book.set('title', req.body.title);
      book.set('author', req.body.author);
      book.set('genre', req.body.genre);
      book.set('read', req.body.read);

      book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })
    .patch((req, res) => {
      const { book } = req;

      // eslint-disable-next-line no-underscore-dangle
      if (req.body._id) {
        // eslint-disable-next-line no-underscore-dangle
        delete req.body._id;
      }

      Object.entries(req.body).forEach((item) => {
        const [key, value] = item;
        book[key] = value;
      });

      book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })
    .delete((req, res) => {
      const { book } = req;

      book.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    });

  return bookRouter;
}

module.exports = routes;
