const mongoose = require('mongoose')
const Joi = require('joi')


const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    author: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    numberInStock: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    body: {
        type: String,
        required: true,
        maxlength: 500,
    },
    genre: {
        type: String,
        required: true
    },
}) 

function validateBook(book) {
    const schema = {
        title: Joi.string().required().min(5).max(50),
        genre: Joi.string().required(),
        numberInStock: Joi.number().required().min(0).max(50),
        body: Joi.string().required().min(0).max(500),
        author: Joi.string().required().min(3).max(50)   
    }

    return Joi.validate(book, schema)
}


const Book = mongoose.model('Book', bookSchema)

exports.validate = validateBook;
exports.Book = Book;