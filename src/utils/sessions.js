//sessions is used to track the sessions that are currently active.
let sessions = new Map();

let usersActive = []
//Created to handle users.

const addUser = ({id, username, room, userSessionID, points}) => {
    //Clean how the data looks.

    let updateIndex = usersActive.findIndex((existingUser)=> existingUser.userSessionID === userSessionID)
    if(updateIndex !== -1){
        usersActive[updateIndex] = {...usersActive[updateIndex], id, loggedIn:true}
        console.log('Users active is :'+JSON.stringify(usersActive, null, 4))
        return {newUser: usersActive[updateIndex], newlyJoined:false}
    }
    //Store user.
    else {
        const newUser = {id, username, room, points, userSessionID, loggedIn: true}
        usersActive.push(newUser)
        console.log('Users active is :'+JSON.stringify(usersActive, null, 4))
        return {newUser, newlyJoined:true}
    }
}

//Remove an active user. 
const removeUser = (id) => {
    // console.log('REMOVE USER.\n')
    const removeIndex = usersActive.findIndex((existingUser)=> existingUser.id === id)
    if(removeIndex!==-1){
        // console.log('Removed:\n'+JSON.stringify(usersActive, null, 4)+'\n')
        return usersActive.splice(removeIndex, 1)[0]
    }
    
    return undefined
}

//Find an active user by id.
const getUser = (id) => {
    const user = usersActive.find((eachActiveUser)=> eachActiveUser.id === id)
    if(user === undefined)
        return {
                error: 'User does not exist.'
            }
    return user
}

//Find all the users in a room.
const getUsersInRoom = (roomName) => {
    return usersActive.filter((eachActiveUser)=> eachActiveUser.room === roomName)
}


const changeLoginStatus = (id) => {
    let changeIndex = usersActive.findIndex((existingUser)=> existingUser.id === id)
    if(changeIndex !== -1){
        usersActive[changeIndex] = {...usersActive[changeIndex], loggedIn: !usersActive[changeIndex].loggedIn}
    }
    // console.log(usersActive)
}

module.exports = {
    sessions,
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    changeLoginStatus
};