const express = require('express');
const sessions = require('../../data/activeSessions')

const join = new express.Router();

const checkAuthenticationStatus = (UUID) => {
    return sessions.has(UUID);
}

join.get('/join', async (req,res)=>{
    console.log('GET request for /join received.\nProceeding to verify if you are worthy to enter the room.');
    const UUID = req.query.id;
    if(!UUID){
        return res.send({error:'Please specify your Room ID, and we will see if we can connect you.'});
        //Discuss about creating a file and serving a file using res.sendFile for this.
    }
    const _status = checkAuthenticationStatus(UUID);
    if(!_status){
        return res.send({error: 'Macha room illai'})
    }
    res.send({name: sessions.get(UUID)});
})

module.exports = join;