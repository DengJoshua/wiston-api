const express = require("express")
const { Customer, validate } = require("../models/customer")
const auth = require("../middlerware/auth")
const router = express.Router()

router.get('/', async (req, res) => {
    const customers = await Customer.find()
    res.send(customers)
})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    res.send(customer)
})

router.post('/', auth, async  (req, res) => {
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let user = await Customer.findOne({ phone: req.body.phone })
    if(user) return res.status(400).send("Phone number already registered.")

    customer = new Customer({
        name: req.body.name,
        phone: req.body.phone
    })

    const newCustomer = await customer.save()
    try {
       res.send(newCustomer)
    } catch (ex) {
        res.send(ex)
    }
})

router.put('/:id', auth, async (req, res) => {
    const customer = await Customer.updateOne({_id: req.params.id}, 
        {$set: { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold}})
    res.send(customer)
})

router.patch('/:id', auth, async (req, res) => {
    const customer = await Customer.updateOne({_id: req.params.id}, 
        {$set: { isGold: req.body.isGold }})
    res.send(customer)
})

router.delete('/:id', auth, async (req, res ) => {
    const deletedCustomer = await Customer.deleteOne({_id: req.params.id})
    res.send(deletedCustomer)
})


module.exports = router;