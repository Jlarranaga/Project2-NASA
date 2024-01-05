//TODO have one favorite model to save all users favroite things. 

const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;


const imageVideoLibSchema = new Schema ({ //TODO update schemas data variables
    title: String,
    url: String,
    date: String
})

const apodSchema = new Schema ({
    title: String,
    url: String,
    date: String
})

const favSchema = new Schema({
    apods: [apodSchema],
    imageVideoLib: [imageVideoLibSchema],
    owner: {
        type: Schema.Types.ObjectId,
        ref: user,
        required: true
    }
})


module.exports = mongoose.model('Favorite', favSchema)