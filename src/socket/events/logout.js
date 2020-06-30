const {
    sessions,
    removeUser,
    getUser,
    getUsersInRoom,
} = require('../../utils/sessions');

module.exports  = (io, socket)=>{
    
    let removedUser;
    console.log('Logout event called.' + socket.id)
    const {error, loggedIn} = getUser(socket.id)
    if(error){
        return;
    }
    if (!loggedIn) {
        removedUser = removeUser(socket.id)
    }
    if (removedUser) {
        console.log("Removing the user..")
        io.to(removedUser.room).emit('toast', `${removedUser.username} has left the server.`)
        io.to(removedUser.room).emit('roomData', {
            roomName: sessions.get(removedUser.room),
            usersInRoom: getUsersInRoom(removedUser.room)
        })
        console.log(getUsersInRoom(removedUser.room))
    }
}
