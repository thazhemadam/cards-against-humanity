const app = require('./app');
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

let users=[];

io.on('connection', (socket)=>{

    // console.log('WebSocket connection.');
    socket.on('create',({name, id}, callback)=>{

        let index=users.findIndex(user=>user.id===id);
        if(index!==-1){return callback(`Room ${id} already exists`);}
        if(name.trim().length===0){return callback("User's name can't be blank");}
        if(id.toString().trim().length===0){return callback("Invalid Room ID");}
        
        let user={
            id: socket.id,
            name: name,
            roomname: id,
            participants: [{
                id: socket.id,
                name: name,
                roomname: id
            }]
        };
        
        users.push(user);
        
        socket.join(user.roomname);
        console.log(`${user.name} with ${socket.id} created the room ${user.roomname}: ${user['participants']}`);
        socket.emit('createToastClient', {roomname: user.roomname});
        io.to(user.roomname).emit('memberList', {users: user.participants});
        callback();
    });

    socket.on('login', ({name, id}, callback)=>{

        let index=users.findIndex(user=>user.roomname===id);
        if(index===-1){return callback(`Room ${id} doesn't exists`);}
        if(name.trim().length===0){return callback("User's name can't be blank");}
        if(id.toString().trim().length===0){return callback("Invalid Room ID");}
        if(users[index].participants.length===7){return callback("Maximum number of users in the room");}
        
        let user={
            id: socket.id,
            name: name,
            roomname: id
        };

        users[index].participants.push(user);
        socket.join(user.roomname);
        socket.emit('createToastOthers', {name: users[index].name, roomname: user.roomname});
        socket.to(user.roomname).broadcast.emit('createToastWelcome', {name: user.name});
        io.to(user.roomname).emit('memberList', {users: users[index].participants});
        console.log(`Welcome ${user.name} to ${user.roomname}. The room now has ${users[index].participants.length} users`);
        callback();

    });

    socket.on('invalid', ({}, callback)=>callback());

    socket.on('sendMessage', ({message, name, roomname})=>{
        io.to(roomname).emit('message', {message, name});
    });

    socket.on('disconnect', ()=>{
        const index=users.findIndex(user=>user.id===socket.id);
        if(index!==-1){
            console.log(`${users[index].name} Left the room`);
            io.to(users[index].roomname).emit('broadcast', {});
            users.splice(index, 1);
        }else{
            users.forEach(user=>{
                const memIndex=user.participants.findIndex(member=>member.id===socket.id);
                if(memIndex!==-1){
                    console.log(`${user.participants[memIndex].name} left the channel`);
                    io.to(user.roomname).emit('userLeft', {name: user.name});
                    user.participants.splice(memIndex, 1);
                    console.log(`The room now has ${user.participants.length} user(s)`);
                }
            });
        }
    });
});


const port = process.env.PORT ||20000;


server.listen(port, ()=>{
    console.log('Server up and running on port '+port);
})