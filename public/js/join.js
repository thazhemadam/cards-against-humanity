
const $joinRoomForm = document.getElementById('join-room');

// Check if a room with the given room id exists true or not.
const roomJoinStatus = async (_id) => {
    const url = '/join'+(_id?'?id='+_id:'')
    return await fetch(url).then(async (response) =>{
        return await response.json().then((data)=> (data.error?false:data.roomName));
    });
}

//When the join-room form is submitted, verify the authenticity and existence of the room. If found to be valid, navigate to the session's page.
$joinRoomForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const $_id = document.getElementById('join-room-id').value.trim();
    const $name = document.getElementById('join-room-name').value.trim();
    const result = await roomJoinStatus($_id);
    if(!result){
        return alert("Sorry. Something went wrong.")
    }
    location.replace("/html/room.html?name="+result+"&id="+$_id)
})

