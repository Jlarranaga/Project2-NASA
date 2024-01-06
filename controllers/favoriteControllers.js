//************************* Import Dependencies ***********************//
const express = require('express')
const axios = require('axios')
const Apod = require('../models/apod')
const Favorite = require('../models/favorite')
const apod = process.env.APOD_API_URL  //TODO <-------------
const imageVideoLib = process.env.IMAGE_VIDEO_LIBRARY

const apiKey = process.env.API_KEY //TODO <--------------

//const Place = require('../models/place')

//************************* Create Router *****************************//
const router = express.Router()

//************************* Routers & Controllers *********************//


//showing all favorites 
router.get('/all', (req, res) =>{
    const {user} = req.session.passport

    Favorite.find({owner: user})
        .then(ownerFavs =>{
            console.log('Favorites: ', ownerFavs)
            res.render('favorite/all', {imageVideo: ownerFavs})
        })
        .catch(err =>{
            console.log(err)
        })

})

//Adding a favorite to the list and displaying it
router.post('/add', async (req, res) =>{
    const {user} = req.session.passport
    const favorite = new Favorite;

    const ivl = req.body
    favorite.owner = user
    favorite.favorite = true
    
    favorite.imageVideoLib.push(ivl)
        try {
            await favorite.save()
            console.log("Saved SUCCESS!")
        }catch (err){
            console.log('ERROR', err)
        }   
            
    res.render('favorite/all', {imageVideo: favorite})
    console.log('favorite: ', favorite)//TODO Delete this line 
})

//Deleting Favorite Item
//TODO FIX favorite index not working, your not calling it when you look at fav details
router.delete('/delete/:id', (req,res, next) =>{
const {user} = req.session.passport
const id = req.params.id

    
    Favorite.find({owner: user})
        .then(ownerFavs =>{
            for(let i = 0; i<ownerFavs.length; i++){
            if(ownerFavs[i].imageVideoLib[0].nasa_id === id ){
                
                if(ownerFavs[i].owner == user){
                    ownerFavs.deleteOne()
                    ownerFavs.save().then(function(){
                        res.redirect('/favorite/all')
                        
                    })
                    break
                }else{
                    res.redirect(`/error?error=You%20Are%20Not%20Allowed%20to%20Delete%20this%20Favorite`)
                }
                //break
            }else{
                //onFavList = false
            }
    
        }
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })

        // .then(deletedFavorite => {
        //     res.redirect('/favorite/all')
        // })
    
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
    //TODO upate to show from favorites. 
const {user} = req.session.passport
const id = req.params.id

    
    Favorite.find({owner: user})
        .then(ownerFavs =>{
            for(let i = 0; i<ownerFavs.length; i++){
            if(ownerFavs[i].imageVideoLib[0].nasa_id === id ){
                
                res.render('favorite/show', {imageVideo: ownerFavs})
                return
            }
    
        }
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })


    // axios(`${imageVideoLib}/search?nasa_id=${id}`)
    // .then(apiRes =>{
    //     const foundData = apiRes.data
    //     res.render('favorite/index', {imageVideo: foundData})
    // })
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