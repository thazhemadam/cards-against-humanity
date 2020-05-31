const path = require('path')
if (process.env.NODE_ENV !== 'production') require("dotenv").config({ path: path.resolve(__dirname, `../config/${process.env.NODE_ENV}.env`)})

const express = require('express');
const app = express();


const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))

const port = process.env.PORT


app.listen(port, ()=>{
    console.log('hello world'+port)
})