const app = require('./app');
const http = require('http');
const socketio = require('socket.io');
const fs=require('fs');

const { sessions, addUser, removeUser, getUser, getUsersInRoom } = require('./utils/sessions');
const {generateMessage} = require('./utils/messages');
const connection = require('./socket/connection')


const server = http.createServer(app);
const io = socketio(server);


io.on('connection',(socket)=> {
    connection(socket, io);
})



const port = process.env.PORT ||20000;


server.listen(port, ()=>{
    console.log('Server up and running on port '+port);
})