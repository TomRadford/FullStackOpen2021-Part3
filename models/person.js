const mongoose = require('mongoose')

uri = process.env.MONGODB_URI

mongoose.connect(uri)
.then(result => {
    console.log('Connected to mongodb')
})
.catch(error => {
    console.log('Error connecting to mongoDB', error.message)
})

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person',personSchema)