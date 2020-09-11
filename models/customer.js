const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')
const Joi = require('joi')


const customerSchema = mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    isGold: {
        type: Boolean
    }
})


function valiadateCustomer(user){
      const schema = {
        name: Joi.string().required().min(3).max(20),
        phone: Joi.string().required().min(10).max(255),
        isGold: Joi.boolean()       
   }
    return Joi.validate(user, schema)
}


const Customer = mongoose.model("Customer", customerSchema)

exports.Customer = Customer;
exports.validate = valiadateCustomer;