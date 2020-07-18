const fs = require('fs');

const {
    getSession,
    setData,
    addUser,
    getUser,
    getUsersInRoom,
    changeLoginStatus
} = require('../utils/sessions');

const sendMessage = require('./events/sendMessage');
const logout = require('./events/logout');
const { isUndefined } = require('util');

let question = "";
let ansArr=[];


const connection = (socket, io) => {
    console.log('New WebSocket Connection : '+socket.id)
    
    socket.on('join', ({
        name,
        room
    }, userSessionID, callback) => {
        //Since addUser returns an "error", and "user" object respectively.
        if (!getSession(room)) {
            return callback('Shoo. Scat. No shortcuts. Either join a room the right way, or make your own.')
        }

        fs.readFile('data/white.json', (err, data) => {
            if (err) throw err;
            let answerList = JSON.parse(data);
            ansArr=[];
            for (let i = 0; i < 10; ++i) {
                let answer = answerList[Math.floor(Math.random() * Math.floor(answerList.length - 1))].text;
                let index = ansArr.findIndex(item => item === answer);
                if (index === -1) {
                    ansArr.push(answer);
                }
            }
        });

        const {
            error,
            newUser,
            newlyJoined,
        } = addUser({
            id: socket.id,
            username: name,
            room,
            points: 0,
            answerCards: ansArr,
            userSessionID
        });

        if (error) {
            return callback(error);
        }

        // console.log('Successfully logged ' + newUser.name + ' into '+sessions.get(newUser.room)+' - '+ newUser.room +'.')
        socket.join(newUser.room);

        if(!newlyJoined){
            socket.emit('toast', 'Welcome back to the room.');
            socket.broadcast.to(newUser.room).emit('toast', `${newUser.username} lost their way for a second there, but is back now!`);
            setTimeout(()=>socket.emit('answerCards', {answers: newUser.answerCards}), 1000);
        }
        else{
            socket.emit('toast', 'Welcome to the room.');
            socket.broadcast.to(newUser.room).emit('toast', `${newUser.username} has joined the party!`);
            if(getUsersInRoom(newUser.room).length>1){
                newUser.question=getUsersInRoom(newUser.room)[0].question;
            }
            setTimeout(()=>socket.emit('answerCards', {answers: ansArr}), 1000);
            addUser({id: socket.id, username: name, room, points: 0, answerCards: ansArr, userSessionID});
        }
        
        if(getUsersInRoom(newUser.room).length>=3){
            let memberList=getUsersInRoom(newUser.room);
            let host=memberList[0];
            let gameSession=getSession(newUser.room);
            io.sockets.connected[host.id].emit('start', question);

            if(isUndefined(gameSession.question)){
                fs.readFile('data/black.json', (err, data) => {
                    if (err) throw err;
                    let questionList = JSON.parse(data.toString());
                    question = questionList[Math.floor(Math.random() * Math.floor(questionList.length - 1))].text;
                });
                // gameSession.question=question;
            }
            
            let cardCzar=memberList[Math.floor(Math.random()*Math.floor(memberList.length-1))].username;
            setTimeout(()=>{
                gameSession=setData(newUser.room, question, cardCzar);
            }, 1000)
            
            socket.on('gameSession', ()=>{
                io.to(room).emit('roomData', {
                    roomName: gameSession.roomName,
                    usersInRoom: memberList,
                    question: gameSession.question,
                    cardCzar: gameSession.card_czar
                });
            });
        }
        
        // if (getUsersInRoom(newUser.room).length < 3) {
        //     io.to(newUser.room).emit('toast', `${3-getUsersInRoom(newUser.room).length} more "friends", and you can get this party started!`);
        // }
        
        // console.log('This is get users in room '+JSON.stringify(getUsersInRoom(newUser.room), null, 4))
        // Send the room's details to the room into which the new user just joined.
        // socket.emit('answerCards', {answers: ansArr});
        // io.to(newUser.room).emit('roomData', {
        //     // test: 'Console.log' 
        //     roomName: getSession(newUser.room),
        //     usersInRoom: getUsersInRoom(newUser.room),
        //     question: question
        // });
        
        callback() //Represents no error in logging in
    });

            
    socket.on('newAnswerCard', ({
        answerTexts,
        answerCard,
        room
    }) => {
        io.to(room).emit('submitAnswer', answerCard);
        fs.readFile('data/white.json', (err, data) => {
            if (err) throw err;
            let answerList = JSON.parse(data);
            let answer = answerList[Math.floor(Math.random() * Math.floor(answerList.length - 1))].text;
            let index = answerTexts.findIndex(item => item === answer);
            if (index === -1) {
                answerTexts.push(answer);
                socket.emit('answerCards', {
                    answers: answerTexts
                });
            }
        });
    });

    socket.on('sendMessage', (message, callback) => {
        sendMessage(socket, io, message, callback)
    })

    socket.on('logout', (callback) => {
        console.log('Logout Event called.')
        changeLoginStatus(socket.id);
        logout(io, socket);
        callback();
    })

    socket.on('disconnect', () => {
                
        if (!getUser(socket.id)) {
            return;
        }
        console.log('Disconnecting.')
        changeLoginStatus(socket.id);
        setTimeout(() => {
            logout(io, socket);
        }, (5000));

    })
}

module.exports = connection;