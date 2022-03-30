const mongoose = require('mongoose')


if ((process.argv.length < 5) && !(process.argv.length === 3)) {
    console.log('To add a person please enter password, name and number. To list persons, enter password.')
    process.exit()
}

password = process.argv[2]
url =
    `mongodb+srv://fullstack:${password}@fullstack.qrmkt.mongodb.net/peopleApp?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = mongoose.Schema({
    id: Number,
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
        process.exit()
    })


}


personName = process.argv[3]
personNumber = process.argv[4]


const person = new Person({
    id: Math.floor(Math.random() * 10000),
    name: personName,
    number: personNumber
})

person.save().then(result => {
    console.log('Person saved')
    mongoose.connection.close()
})