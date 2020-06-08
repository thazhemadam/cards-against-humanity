const path = require('path');
if (process.env.NODE_ENV !== 'production') require("dotenv").config({ 
    path: path.resolve(__dirname, `../config/${process.env.NODE_ENV}.env`)
});

const express = require('express');

const app = express();

const publicDirectoryPath = path.resolve(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

const createID = (name) => {
    //insert code for creating jsonwebtoken with room name, that will serve as a unique room id.
    return _id;
}

app.get('/host', (req, res) => {
    console.log('GET request for /host received.\nProceeding to generate cool, unique room id to be returned as response.');
    const _id = createID(req.query.roomname);
    res.send({roomid: _id})
  })
  
module.exports = app;
