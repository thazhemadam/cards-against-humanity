const app = require('./app');
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

let users=[];

io.on('connection', (socket)=>{

    console.log('WebSocket connection.')
    // socket.on('create',({name, roomid}, callback)=>{

        
    //     let index=users.findIndex(user=>user.roomid===roomid);
    //     if(index!==-1){return callback(`Room ${roomid} already exists`);}
    //     if(name.trim().length===0){return callback("User's name can't be blank");}
    //     if(roomid.trim().length===0){return callback("Invalid Room ID");}
        
    //     let user={
    //         id: socket.id,
    //         name: name,
    //         roomid: roomid
    //     };
        
    //     users.push(user);
        
    //     socket.join(user.roomid);
    //     console.log(`${user.name} with ${socket.id} created the room ${user.roomid}: ${users}`);
    //     callback();
    // });

    // socket.on('disconnect', ()=>{
    //     const index=users.findIndex(user=>user.id===socket.id);
    //     if(index!==-1){
    //         console.log(`${users[index].name} Left the room`);
    //         users.splice(index, 1);
    //     }
    // });
});


const port = process.env.PORT ||20000;


server.listen(port, ()=>{
    console.log('Server up and running on port '+port);
})