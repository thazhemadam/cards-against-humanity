
const $joinRoomForm = document.getElementById('join-room');

// Check if a room with the given room id exists true or not.
const roomJoinStatus = async (_id) => {
    const url = '/join'+(_id?'?id='+_id:'')
    return await fetch(url).then(async (response) =>{
        return await response.json().then((data)=> (data.error?false:data));
    });
}

//When the join-room form is submitted, verify the authenticity and existence of the room. If found to be valid, navigate to the session's page.
$joinRoomForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const $id = document.getElementById('join-room-id')
    const _id = $id.value.trim();
    const $name = document.getElementById('join-room-name').value.trim();
    const {roomName, userid} = await roomJoinStatus(_id);
    if(!roomName){
        $id.value = ''
        return alert("Oops. Looks like that didn't work. Try again with a valid room ID maybe?")
    }
    sessionStorage.setItem('roomid',_id);
    sessionStorage.setItem('userid',userid);
    location.replace("/html/room.html?name="+$name+"&room="+roomName)
})

