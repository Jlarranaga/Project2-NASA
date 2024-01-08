//************************* Import Dependencies ***********************//
const express = require('express')
const axios = require('axios')
//const Apod = require('../models/apod')
const apod = process.env.APOD_API_URL  
const imageVideoLib = process.env.IMAGE_VIDEO_LIBRARY
const Favorite = require('../models/favorite')
const apiKey = process.env.API_KEY 

//***************************** DOM Elements & Constants ***************//
//const wanderAudio = new Audio("/public/audio/wandering-6394.mp3")

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
    //wanderAudio.play();
    const {search} = req.body
   
    axios(`${imageVideoLib}/search?q=${search}&media_type=image&page_size=50`) //<-- add "/search?q={'KEYWORD HERE'}"
        .then(apiRes =>{
            const foundData = apiRes.data 
            
            res.render('imageVideoLib/imageIndex', {imageVideo: foundData})
            
        })
})

router.post('/videoIndex', (req, res) =>{
    
    const {search} = req.body
   
    axios(`${imageVideoLib}/search?q=${search}&media_type=video&page_size=50`) //<-- add "/search?q={'KEYWORD HERE'}"
        .then(apiRes =>{
            const foundData = apiRes.data 
            res.render('imageVideoLib/videoIndex', {imageVideo: foundData})
            
        })
})

//Showing the video or image and able to favorite and save to users list
router.get('/:id', (req,res)=>{
    const id = req.params.id
    let onFavList = false
    
    if(req.session.passport){
        const {user} = req.session.passport
    Favorite.find({owner: user})
        .then(ownerFavs =>{
            if(ownerFavs.length !== 0){

            for(let i = 0; i<ownerFavs.length; i++){
            if(ownerFavs[i].imageVideoLib[0].nasa_id === id ){
                onFavList = true
                break
            }else{
                onFavList = false
            }
    }
        }
        })
    }
   

    axios(`${imageVideoLib}/search?nasa_id=${id}`)
    .then(apiRes =>{
        const foundData = apiRes.data
        res.render('imageVideoLib/show', {imageVideo: foundData, favorite: onFavList})
    })
    
})

//********************* Export **********************//
module.exports = router