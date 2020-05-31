const app = require('./app')

const http = require('http')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server) 

console.log('before connecting')
io.on('connection',(socket)=>{
    console.log('IO connect')

    socket.emit('welcomeEvent')
    socket.on('join',(message)=>{
        console.log('Joined the room.'+message)
    })
})


const port = 20000||process.env.PORT


server.listen(port, ()=>{
    console.log('hello world'+port)
})