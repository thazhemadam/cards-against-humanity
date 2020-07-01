const {
    sessions,
    removeUser,
    getUser,
    getUsersInRoom,
} = require('../../utils/sessions');

module.exports  = (io, socket)=>{
    
    let removedUser;
    console.log(`Logout event called. + ${socket.id}`)
    const {error, loggedIn} = getUser(socket.id)
    if(error){
        return;
    }
    if (!loggedIn) {
        removedUser = removeUser(socket.id)
    }
    if (removedUser) {
        console.log("\nRemoving the user")
        const removedUserRoom = removedUser.room
        io.to(removedUserRoom).emit('toast', `${removedUser.username} has left the server.`)
        io.to(removedUserRoom).emit('roomData', {
            roomName: sessions.get(removedUserRoom),
            usersInRoom: getUsersInRoom(removedUserRoom)
        })
        if(getUsersInRoom(removedUserRoom).length === 0){
            sessions.delete(removedUserRoom)
            console.log(`Removed room : ${removedUserRoom}`)
        }
        console.log(getUsersInRoom(removedUserRoom))
    }
}
