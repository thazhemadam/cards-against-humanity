const fs = require('fs');
const {
    sessions,
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    changeLoginStatus
} = require('../utils/sessions');
const sendMessage = require('./sendMessage');

let question = "";

fs.readFile('data/black.json', (err, data) => {
    if (err) throw err;
    let questionList = JSON.parse(data.toString());
    question = questionList[Math.floor(Math.random() * Math.floor(questionList.length - 1))].text;
});

const connection = (socket, io) => {
    console.log('New WebSocket Connection.')

    socket.on('join', ({
        name,
        room
    }, userSessionID, callback) => {

        //Since addUser returns an "error", and "user" object respectively.
        if (!sessions.has(room)) {
            return callback('Shoo. Scat. No shortcuts. Either join a room the right way, or make your own.')
        }

        const {
            error,
            newUser,
            newlyJoined
        } = addUser({
            id: socket.id,
            username: name,
            room,
            userSessionID,
            points: 0
        })
        if (error) {
            return callback(error);
        }

        // console.log('Successfully logged ' + newUser.name + ' into '+sessions.get(newUser.room)+' - '+ newUser.room +'.')
        socket.join(newUser.room);

        if(!newlyJoined){
                socket.emit('toast', 'Welcome back to the room.');
                socket.broadcast.to(newUser.room).emit('toast', `${newUser.username} lost his way for a second there, but is back now!`)
        }
        else{
            socket.emit('toast', 'Welcome to the room.');
            socket.broadcast.to(newUser.room).emit('toast', `${newUser.username} has joined the party!`)
        }

        // if (getUsersInRoom(newUser.room).length < 3) {
        //     io.to(newUser.room).emit('toast', `${3-getUsersInRoom(newUser.room).length} more "friends", and you can get this party started!`);
        // }

        // console.log('This is get users in room '+JSON.stringify(getUsersInRoom(newUser.room), null, 4))
        //Send the room's details to the room into which the new user just joined.
        io.to(newUser.room).emit('roomData', {
            // test: 'Console.log' 
            roomName: sessions.get(newUser.room),
            usersInRoom: getUsersInRoom(newUser.room),
            question: question
        });

        fs.readFile('data/white.json', (err, data) => {
            if (err) throw err;
            let ansArr = [];
            let answerList = JSON.parse(data);
            for (let i = 0; i < 10; ++i) {
                let answer = answerList[Math.floor(Math.random() * Math.floor(answerList.length - 1))].text;
                let index = ansArr.findIndex(item => item === answer);
                if (index === -1) {
                    ansArr.push(answer);
                }
            }
            socket.emit('answerCards', {
                answers: ansArr
            });
        });

        callback() //Represents no error in logging in
    })

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



    socket.on('disconnect', () => {

        if (!socket.id) {
            return
        }
        changeLoginStatus(socket.id);


        setTimeout(() => {

            let removedUser;
            // console.log('Disconnect event called.')
            if (!getUser(socket.id).loggedIn) {
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
        }, (5000));

    })
}


module.exports = connection;