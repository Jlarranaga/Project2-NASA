//************************* Import Dependencies ***********************//
const express = require('express')
const axios = require('axios')
const Apod = require('../models/apod')
const apod = process.env.APOD_API_URL  //TODO <-------------
const imageVideoLib = process.env.IMAGE_VIDEO_LIBRARY

const apiKey = process.env.API_KEY //TODO <--------------

//const Place = require('../models/place')

//************************* Create Router *****************************//
const router = express.Router()

//************************* Routers & Controllers *********************//

//** NASA Image Video Library */
//Search bar to find image or video
router.get('/search', (req, res) =>{
    res.render('imageVideoLib/search')
})

//Search response with all images matching search keywords
router.post('/imageIndex', (req, res) =>{
    //TODO User must search, grab keyword from req.body
    const {search} = req.body
    //console.log('the search?', search)
    //console.log('req body', req.body)
    axios(`${imageVideoLib}/search?q=${search}&media_type=image&page_size=50`) //<-- add "/search?q={'KEYWORD HERE'}"
        .then(apiRes =>{
            const foundData = apiRes.data 
            //console.log('the data?', foundData)
            res.render('imageVideoLib/imageIndex', {imageVideo: foundData})
            
        })
})

router.post('/videoIndex', (req, res) =>{
    //TODO User must search, grab keyword from req.body
    const {search} = req.body
    //console.log('the search?', search)
    //console.log('req body', req.body)
    axios(`${imageVideoLib}/search?q=${search}&media_type=video&page_size=50`) //<-- add "/search?q={'KEYWORD HERE'}"
        .then(apiRes =>{
            const foundData = apiRes.data 
            res.render('imageVideoLib/videoIndex', {imageVideo: foundData})
            
        })
})

//Showing the video or image and able to favorite and save to users list
router.get('/:id', (req,res)=>{

    const id = req.params.id

    axios(`${imageVideoLib}/search?nasa_id=${id}`)
    .then(apiRes =>{
        const foundData = apiRes.data
        res.render('imageVideoLib/show', {imageVideo: foundData})
    })
})

//********************* Export **********************//
module.exports = router

//TODO Ask Timm, would I have to have mulitple models? for each API? 
//Answer: You do not need a seperate model for each API. Schema is onlu used for saving data not displaying data. 

//Favorites model, add notes to fav image, owner field, favorites tab. 
//Parse how to get that data, build request body on API responses. 

//Data from API can be shown BUT doesnt have to be saved
//Saving data to mongoose database

//last router on places app, shows data from API but doesnt neccssary save that data unless we want. 
//... this allows us to show any data we want and only save what we need to users favorites. 

//TODO Work on ERD and WIREFRAME - later on. 