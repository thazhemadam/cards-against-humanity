const express = require('express');
// const jsonwebtoken = require('jwt')
const host = new express.Router();

const createID = (name) => {
    //insert code for creating jsonwebtoken with room name, that will serve as a unique room id.
    _id = 'hello';
    return _id;
}

host.get('/host', async (req, res) => {
    console.log('GET request for /host received.\nProceeding to generate cool, unique room id to be returned as response.');
    const _id = createID(req.query.roomname);
    res.send({roomid: _id});
})


module.exports = host;
