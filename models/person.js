const mongoose = require('mongoose')

const uri = process.env.MONGODB_URI

mongoose.connect(uri)
  .then(result => {
    console.log('Connected to mongodb')
  })
  .catch(error => {
    console.log('Error connecting to mongoDB', error.message)
  })

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => {
        return ((v[2] === '-') || (v[3] === '-') )
      },
      message: props => `${props.value} is missing the '-' symbol after the first or second digit.`
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person',personSchema)