const express = require('express');

const join = new express.Router();

const checkAuthenticationStatus = (UUID) => {
    //Insert cool function that will determine authentication status.

}

join.get('/join', async (req,res)=>{
    console.log('GET request for /join received.\nProceeding to verify if you are worthy to enter the room.');
    if(!req.query.id){
        return res.send({error:'Please specify your Room ID, and we will see if we can connect you.'});
        //Discuss about creating a file and serving a file using res.sendFile for this.
    }
    const _status = checkAuthenticationStatus(req.query.id);;
    res.send({status: _status});
})


module.exports = join;