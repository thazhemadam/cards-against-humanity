const app = require('./app');
const http = require('http');
const socketio = require('socket.io');

const { sessions, addUser, removeUser, getUser, getUsersInRoom } = require('./utils/sessions')



const server = http.createServer(app);
const io = socketio(server);

io.on('connection',(socket)=>{
    console.log('New WebSocket Connection.')
    socket.emit('message','Welcome.')
    socket.broadcast.emit('message','A new user has joined.');


    socket.on('join',({name, room}, callback)=>{
        
        //Since addUser returns an "error", and "user" object respectively.
        const {error, newUser} = addUser({ id: socket.id, name, room, points: 0 })
        
        
        if(error){
            return callback(error)
        }
    
        console.log('Successfully logged into '+sessions.get(newUser.room))
        socket.join(newUser.room)
    
        // socket.emit('message',generateMessage(`Welcome ${newUser.username}`),'Server')   
        // socket.broadcast.to(newUser.room).emit('message',generateMessage(`${newUser.username} has joined!`),'Server')  
    
        // io.to(newUser.room).emit('roomData',{
        //         roomName: newUser.room,
        //         usersInRoom: getUsersInRoom(newUser.room)
        // })
    
        callback()  //Represents no error in logging in
    })
})



const port = process.env.PORT ||20000;


server.listen(port, ()=>{
    console.log('Server up and running on port '+port);
})