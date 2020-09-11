const express = require('express')
const app = express()
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const cors = require('cors')

const config = require('config')


if (!config.get('jwtPrivateKey')) {
        console.error('FATAL ERROR: jwtPrivateKey is not defined');
        process.exit(1)
}

const db = config.get("db")

mongoose.connect(db)
        .then(() => console.log("Successfully connected to mongo"))
        .catch(err => console.log("An error occured", err))

app.use(cors())

app.use(bodyParser.json())
app.use(express.json())        
app.use("/api/books", require('./routes/books'))
app.use('/api/users/', require('./routes/users'))
app.use('/api/auth/', require('./routes/auth'))
app.use('/api/customers/', require('./routes/customers'))


const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Listening on port ${port}`)) 

