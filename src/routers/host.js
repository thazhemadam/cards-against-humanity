const path = require('path')
if (process.env.NODE_ENV !== 'production') require("dotenv").config({ 
    path: path.resolve(__dirname, `../config/${process.env.NODE_ENV}.env`)
});

const express = require('express');
const short = require('short-uuid')


const {sessions} = require('../utils/sessions')

const host = new express.Router();


host.get('/host', async (req, res) => {
    // console.log('GET request for /host received.\nProceeding to generate cool, unique room id to be returned as response.');
    
    const roomName = req.query.roomname;
    if(!roomName){
        return {error: 'Please enter room name.'}
    }
    const _id = short.generate();
    const user_id = short.generate();
    console.log(`The room ${roomName}  has been assigned the id ${_id}`);
    sessions.set(_id, roomName);
    // console.log(sessions);
    res.send({_id, user_id});
})


module.exports = host;
