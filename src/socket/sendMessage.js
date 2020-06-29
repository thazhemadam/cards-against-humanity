const {generateMessage} = require('../utils/messages');
const { sessions, addUser, removeUser, getUser, getUsersInRoom } = require('../utils/sessions');

const sendMessage = (socket, io, message, callback)=> {

    const {error, username, room} = getUser(socket.id)
    if(error){
        callback(error)
    }        
    io.to(room).emit('message',generateMessage(message),username)
    callback()
}

module.exports = sendMessage;