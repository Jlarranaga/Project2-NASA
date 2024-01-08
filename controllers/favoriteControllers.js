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

    //ivl.date_created = !!ivl.date_created
    //ivl.description = !!ivl.description
    
    favorite.imageVideoLib.push(ivl)
        try {
            await favorite.save()
        }catch (err){
            console.log('ERROR', err)
        }   
            
        Favorite.find({owner: user})
        .then(ownerFavs =>{
            res.render('favorite/all', {imageVideo: ownerFavs})
        })
        .catch(err =>{
            console.log(err)
        })

})

//Deleting Favorite Item
router.delete('/delete/:id', (req,res, next) =>{
const {user} = req.session.passport
const id = req.params.id

    Favorite.find({owner: user})
        .then(ownerFavs =>{
            for(let i = 0; i<ownerFavs.length; i++){
            if(ownerFavs[i].imageVideoLib[0].nasa_id === id ){
                if(ownerFavs[i].owner == user){
                    return ownerFavs[i].deleteOne()
                }else{
                    res.redirect(`/error?error=You%20Are%20Not%20Allowed%20to%20Delete%20this%20Favorite`)
                }
            }else{
                
            }
        }
        })
        .then(deletedFavorite => {
            res.redirect('/favorite/all')
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
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
const {user} = req.session.passport
const id = req.params.id
console.log('ID SENT: ', id)
    
    Favorite.find({owner: user})
        .then(ownerFavs =>{
            for(let i = 0; i<ownerFavs.length; i++){
            if(ownerFavs[i].imageVideoLib[0].nasa_id === id ){
                console.log('FAV ID: ', ownerFavs[i].imageVideoLib[0].nasa_id)
                
                res.render('favorite/show', {imageVideo: ownerFavs[i]})
                console.log('OWNERFAVS: ', ownerFavs[i])
                return
            }
    
        }
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})

//Updating Favorite
router.put('/update/:id', async (req,res, next) => {
    const {user} = req.session.passport
    const id = req.params.id

    const updatedFav = req.body
    
    delete updatedFav.owner
    updatedFav.owner = user

    console.log('UPDATED FAV: ', updatedFav)
    updatedFav.date = !!updatedFav.date
    updatedFav.description = !!updatedFav.description

    console.log('DESCRIPTION: ',updatedFav.date_created)
    console.log('UPDATED FAV, REQ.BODY: ', updatedFav)

    if(updatedFav.date === true){
        try{
        const apiRes = await axios(`${imageVideoLib}/search?nasa_id=${id}`) 
        
            const foundData = apiRes.data 
            console.log('FOUND DATA: ', foundData)
            console.log('FOUND DATA DEEPER: ', foundData.collection.items[0])
            updatedFav.date = foundData.collection.items[0].data[0].date_created
            console.log('UPDATED FAV: ', updatedFav)
        } catch (err){
            return res.redirect(`/error?error=${err}`)
        }
           
    }

    if(updatedFav.description === true){
        try{
            const apiRes = await axios(`${imageVideoLib}/search?nasa_id=${id}`) 
                const foundData = apiRes.data 
                updatedFav.description = foundData.collection.items[0].data[0].description
            } catch (err){
                return res.redirect(`/error?error=${err}`)
            }
    }

    console.log('UPDATED FAV 2nd: ', updatedFav)

    Favorite.find({owner: user})
        .then(async ownerFavs =>{
            for(let i = 0; i<ownerFavs.length; i++){
            if(ownerFavs[i].imageVideoLib[0].nasa_id === id ){
                if(ownerFavs[i].owner == user){
                    
            
                    await ownerFavs[i].updateOne({$set: {"imageVideoLib": updatedFav}})
                    console.log('UPDATING...')
                    return
                }else{
                    res.redirect(`/error?error=You%20Are%20Not%20Allowed%20to%20Delete%20this%20Favorite`)
                }
                
            }else{
                
            }
            
        }
        
        })
        .then(updatedFavorite => {
            console.log('INSIDE LAST .THEN')
            res.redirect(`/favorite/${id}`)
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
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