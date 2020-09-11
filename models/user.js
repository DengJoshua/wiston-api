const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')
const Joi = require('joi')


const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    isAdmin: Boolean
})


userSchema.methods.generateAuthToken = function() {
    const token =  jwt.sign({ 
            _id: this._id,
            username: this.username,
            email: this.email,
            isAdmin: this.isAdmin
        }, config.get("jwtPrivateKey"))
    return token
}

function valiadateUser(user){
      const schema = {
        email: Joi.string().required().email(),
        username: Joi.string().required().min(3).max(20),
        password: Joi.string().required().min(5).max(255),
        isAdmin: Joi.boolean()       
   }
    return Joi.validate(user, schema)
}


const User = mongoose.model("User", userSchema)

exports.User = User;
exports.validate = valiadateUser;