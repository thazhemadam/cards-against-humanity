const {generateMessage} = require('../../utils/messages');
const { getUser } = require('../../utils/sessions');

module.exports = (socket, io, message, callback)=> {

    const {error, username, room} = getUser(socket.id)
    if(error){
        callback(error)
    }        
    io.to(room).emit('message',generateMessage(message),username)
    callback()
}

