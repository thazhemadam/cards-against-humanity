
const $joinRoomForm = document.getElementById('join-room')

// Check if such a room with the given room id exists true or not.
const roomJoinStatus = async (_id) => {
    const url = '/join'+(_id?'?id='+_id:'')
    return await fetch(url).then(async (response) =>{
        return await response.json().then((data)=> (data.error?false:data.name));
    });
}

$joinRoomForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const $_id = document.getElementById('join-room-id').value.trim();
    const result = await roomJoinStatus($_id);
    if(!result){
        return alert("Sorry. Something went wrong.")
    }
    location.replace("/html/room.html?name="+result+"&id="+$_id)
})

