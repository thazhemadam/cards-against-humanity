//sessions is used to track the sessions that are currently active.
let sessions = new Map();

let usersActive = []
//Created to handle users.

const addUser = ({id, name, room, points}) => {
    //Clean how the data looks.
    
    //Validate Data
    if(!name  || !room){
        return {
            error: 'Shoo. Scat. No shortcuts. Either join a room the right way, or make your own.'
        }
    }

    //Store user.
    const newUser = {id, name, room, points}
    usersActive.push(newUser)
    console.log('Users active is :'+JSON.stringify(usersActive, null, 4))
    return {newUser}
}

//Remove an active user. 
const removeUser = (id) => {
    const removeIndex = usersActive.findIndex((existingUser)=> existingUser.id === id)
    if(removeIndex!==-1){
        return usersActive.splice(removeIndex, 1)[0]
    }
}

//Find an active user by id.
const getUser = (id) => {
    const user = usersActive.find((eachActiveUser)=> eachActiveUser.id === id)
    if(user === undefined)
        return {username: undefined, room:undefined}
    return user
}

//Find all the users in a room.
const getUsersInRoom = (roomName) => {
    return usersActive.filter((eachActiveUser)=> eachActiveUser.room === roomName)
}


module.exports = {
    sessions,
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};