const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const imageVideoLibSchema = new Schema ({
    title: String,
    url: String,
    date: String
})

module.exports = mongoose.model('Apod', imageVideoLibSchema)