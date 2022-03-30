require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { response } = require('express')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('content', function (req , res) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

const errorHandler = (error, req, res, next) => {
    console.log(error)

    if (error.name === "CastError") {
        return res.status(400).send({error: "Malformatted ID"})
    }
    
    next(error)
}

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons)
    }
    )
    .catch(error => next(error))
})


app.get('/info', (req, res) => {
    Person.count({}, (error, count) => {
        res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
        `)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => {next(error)})
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedNote => { 
        res.json(updatedNote)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    body = req.body
    if (!body.name && !body.number)  {
        return res.status(400).json({
            error: 'Name and number missing'
        })
    }

    if (!body.name)  {
        return res.status(400).json({
            error: 'Name missing'
        })
    }

    if (!body.number)  {
        return res.status(400).json({
            error: 'Number missing'
        })
    }

    // if (persons.find(person => person.name === body.name)) {
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person =  new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })

})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => { console.log(`App listening on ${PORT}`) })