const express = require('express')
const { User, validate } = require('../models/user')
const bycrpt = require('bcrypt')
const _ = require('lodash')
const auth = require('../middlerware/auth')
const admin = require('../middlerware/admin')
const router = express.Router()


router.get("/", [auth, admin], async (req, res) => {
    const users = await User.find()
    res.send(users)
})

router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if(user) return res.status(400).send("User already registered.")

    user = new User(_.pick(req.body, ['username', 'email', 'password' ])) 
    const salt = await bycrpt.genSalt(10)
    user.password = await bycrpt.hash(user.password,  salt)    
    await user.save()

    const token = user.generateAuthToken()    
    
    res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "email", "username"]))

})

router.patch('/:id', auth, async (req, res) => {
    const user = await User.updateOne({_id: req.params.id}, 
        {$set: { username: req.body.username, email: req.body.email  }})

    const update = await User.findById(req.params.id)   

    const token = update.generateAuthToken()

    res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(user)
})

router.delete("/:id", [auth, admin], async (req, res) => {
    await User.deleteOne({  _id: req.params.id })
    res.send("DELETED.")
})




module.exports = router;