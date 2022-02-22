const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('content', function (req , res) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons =
    [
        {
            "id": 1,
            "name": "Arto Hellas",
            "number": "040-123456"
        },
        {
            "id": 2,
            "name": "Ada Lovelace",
            "number": "39-44-5323523"
        },
        {
            "id": 3,
            "name": "Dan Abramov",
            "number": "12-43-234345"
        },
        {
            "id": 4,
            "name": "Mary Poppendieck",
            "number": "39-23-6423122"
        }
    ]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})


app.get('/info', (req, res) => {
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    id = Number(req.params.id)
    const person = persons.filter(person => person.id === id)
    if (person.length > 0) {
        res.json(person)
    } else {
        res.status(400).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    id = Number(req.params.id)
    if (persons.find(person => person.id === id)) {
        persons = persons.filter(person => person.id !== id)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
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

    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: Math.floor(Math.random()*10000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    res.json(person)

})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => { console.log(`App listening on ${PORT}`) })