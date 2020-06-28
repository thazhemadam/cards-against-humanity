const short = require('short-uuid')
const { sessions: testSessions, addUser, removeUser, getUser, getUsersInRoom } = require('../../../src/utils/sessions')

test('Check if sessions are being added and detected correctly.', () => {
    const id = short.generate();
    const roomName = 'test-room';
    testSessions.set(id, roomName);    
    expect(testSessions.has(id)).toEqual(true)
})

test('Check if users are being correctly added to a room', ()=>{

})

test('Check if users are being correctly removed from a room', ()=>{

})

test('Check if user details are being correctly retrieved', ()=>{

})

test('Check if all the users in a room are being correctly retrieved', ()=>{

})
