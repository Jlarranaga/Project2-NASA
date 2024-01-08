const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const apodSchema = new Schema ({
    title: String,
    url: String,
    date: String, 
    media_type: String,
    description: String
})

module.exports = mongoose.model('Apod', apodSchema)