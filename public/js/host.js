//getRoomID will return the UUID RoomID generated.
const getRoomID = async (name) => {
    const url = "/host?roomname="+name
    return await fetch(url).then(async (response) =>{
        return await response.json().then((data)=> (data.error?false:data._id));
    });
}

//When the host-room form is filled and submitted, generate a UUID for the sessions, track the session, and also navigate to the session's room.
$hostRoom = document.getElementById('host-room');
$hostRoom.addEventListener("submit", async (e)=>{
    e.preventDefault();
    console.log('Host-Room form submitted.')
    $name=document.getElementById('host-name').value.trim();
    $room=document.getElementById('room-name').value.trim();
    const _id = await getRoomID($room).then((data)=>(data)).catch(err=>console.log(err));
    console.log(_id);
    _id?location.replace("/html/room.html?user="+$name+"&room="+$room+"&id="+_id):alert("Sorry. Looks like something went wrong. Try again later?");
    alert(_id);
})
