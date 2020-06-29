const app = require('./app');
const http = require('http');
const socketio = require('socket.io');
const fs=require('fs');

const { sessions, addUser, removeUser, getUser, getUsersInRoom } = require('./utils/sessions');
const {generateMessage} = require('./utils/messages');



const server = http.createServer(app);
const io = socketio(server);
let question="";

fs.readFileSync('data/black.json', (err, data)=>{
    if (err) throw err;
    let questionList=JSON.parse(data.toString());
    question=questionList[Math.floor(Math.random()*Math.floor(questionList.length-1))].text;
});

io.on('connection',(socket)=>{
    console.log('New WebSocket Connection.')

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
        socket.join(newUser.room);

        socket.emit('toast', 'Welcome to the room.');
        socket.broadcast.to(newUser.room).emit('toast', `${newUser.username} has joined the party!`)

        if(getUsersInRoom(newUser.room).length<3){
            return socket.emit('toast', `${3-getUsersInRoom(newUser.room).length} more "friends", and you can get this party started!`);
        }
        
        // console.log('This is get users in room '+JSON.stringify(getUsersInRoom(newUser.room), null, 4))
        //Send the room's details to the room into which the new user just joined.
        io.to(newUser.room).emit('roomData',{
                // test: 'Console.log' 
                roomName: sessions.get(newUser.room),
                usersInRoom: getUsersInRoom(newUser.room),
                question: question 
        });

        fs.readFile('data/white.json', (err, data)=>{
            if (err) throw err;
            let ansArr=[];
            let answerList=JSON.parse(data);
            for(let i=0; i<10; ++i){
                let answer=answerList[Math.floor(Math.random()*Math.floor(answerList.length-1))].text;
                let index=ansArr.findIndex(item=>item===answer);
                if(index===-1){ansArr.push(answer);}
            }
            socket.emit('answerCards', {answers: ansArr});
        });

        callback()  //Represents no error in logging in
    })
    
    socket.on('newAnswerCard', ({answerTexts, answerCard, room})=>{
        io.to(room).emit('submitAnswer', answerCard);
        fs.readFile('data/white.json', (err, data)=>{
            if (err) throw err;
            let answerList=JSON.parse(data);
            let answer=answerList[Math.floor(Math.random()*Math.floor(answerList.length-1))].text;
            let index=answerTexts.findIndex(item=>item===answer);
            if(index===-1){
                answerTexts.push(answer);
                socket.emit('answerCards', {answers: answerTexts});
            }
        });
    });

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