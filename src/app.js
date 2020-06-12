const path = require('path');
if (process.env.NODE_ENV !== 'production') require("dotenv").config({ 
    path: path.resolve(__dirname, `../config/${process.env.NODE_ENV}.env`)
});

const express = require('express');
const hostRouter = require('./routers/host')
const joinRouter = require('./routers/join')

const app = express();
const publicDirectoryPath = path.resolve(__dirname, '../public');

app.use(express.static(publicDirectoryPath));
app.use(hostRouter);
app.use(joinRouter);
  
module.exports = app;
