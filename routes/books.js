const express = require("express")
const { Book, validate } = require("../models/book")
const auth = require("../middlerware/auth")
const admin = require("../middlerware/admin")
const router = express.Router()

router.get('/', async (req, res) => {
    const books = await Book.find()
    res.send(books)
})

router.get('/:id', async (req, res) => {
    const book = await Book.findById(req.params.id)
    res.send(book)
})

router.post('/', auth, async  (req, res) => {
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)


    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        numberInStock: req.body.numberInStock,
        body: req.body.body,
        genre: req.body.genre
    })

    const newBook = await book.save()
    try {
       res.send(newBook)
    } catch (ex) {
        res.send(ex)
    }
})

router.put('/:id', auth, async (req, res) => {
    const book = await Book.updateOne({_id: req.params.id}, 
        {$set: { title: req.body.title, author: req.body.author,
        numberInStock: req.body.numberInStock,
        body: req.body.body, genre: req.body.genre
    }})
    res.send(book)
})

router.patch('/:id', auth, async (req, res) => {
    const book = await Book.updateOne({_id: req.params.id}, 
        {$set: { numberInStock: req.body.numberInStock }})
    res.send(book)
})

router.delete('/:id', [auth, admin], async (req, res ) => {
    const deletedBook = await Book.deleteOne({_id: req.params.id})
    res.send(deletedBook)
})


module.exports = router;