const app = require('./app');
const http = require('http');
const socketio = require('socket.io');

const { sessions, addUser, removeUser, getUser, getUsersInRoom } = require('./utils/sessions');
const {generateMessage} = require('./utils/messages');
const { text } = require('express');



const server = http.createServer(app);
const io = socketio(server);

io.on('connection',(socket)=>{
    console.log('New WebSocket Connection.')
    // socket.emit('message','Welcome.')
    // socket.broadcast.emit('message','A new user has joined.');


    socket.on('join',({name, room}, callback)=>{
        
        //Since addUser returns an "error", and "user" object respectively.
        if(!sessions.has(room)){
            return callback('Shoo. Scat. No shortcuts. Either join a room the right way, or make your own.')
        }
        
        const {error, newUser} = addUser({ id: socket.id, username:name, room, points: 0 })
        if(error){
            return callback(error)
        }
    
        // console.log('Successfully logged ' + newUser.name + ' into '+sessions.get(newUser.room)+' - '+ newUser.room +'.')
        socket.join(newUser.room)
    
        socket.emit('toast', 'Welcome to the room.')
        socket.broadcast.to(newUser.room).emit('toast', `${newUser.username} has joined the party!`)

        // console.log('This is get users in room '+JSON.stringify(getUsersInRoom(newUser.room), null, 4))
        io.to(newUser.room).emit('roomData',{
                // test: 'Console.log' 
                roomName: sessions.get(newUser.room),
                usersInRoom: getUsersInRoom(newUser.room) 
        })
    
        callback()  //Represents no error in logging in
    })

    socket.on('sendMessage', (message, callback)=> {

        const {error, username, room} = getUser(socket.id)
        if(error){
            callback(error)
        }        
        io.to(room).emit('message',generateMessage(message),username)
        callback()
    })

    socket.on('disconnect', () => {
        const removedUser = removeUser(socket.id)

        // console.log('removed user: '+removedUser.username)
        if(removedUser){
            console.log('removed.')
            io.to(removedUser.room).emit('toast',`${removedUser.username} has left the server.`)
            io.to(removedUser.room).emit('roomData', {
                roomName: sessions.get(removedUser.room),
                usersInRoom: getUsersInRoom(removedUser.room)
            })  
        }
    })
})



const port = process.env.PORT ||20000;


server.listen(port, ()=>{
    console.log('Server up and running on port '+port);
})