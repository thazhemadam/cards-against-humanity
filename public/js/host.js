//getRoomID will return the UUID RoomID generated.
const getRoomID = async (name) => {
    const url = "/host?roomname="+name
    return await fetch(url).then(async (response) =>{
        return await response.json().then((data)=> (data.error?false:data));
    });
}


$hostRoom = document.getElementById('host-room');
$hostRoom.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const $name=document.getElementById('host-name').value.trim();    //host-name
    let roomName=document.getElementById('room-name').value.trim();   //room-name

    const {_id, user_id} = await getRoomID(roomName).then((data)=>(data)).catch(err=>console.log(err));
    console.log('Room ID generated: '+_id)
    console.log('User ID generated: '+user_id)
    //if _id has been generated, the name, and room are detailed in the URL
    sessionStorage.setItem('roomid',_id)
    sessionStorage.setItem('userid',user_id)
    _id?location.replace("/html/room.html?name="+$name+"&room="+roomName):alert("Sorry. Looks like something went wrong. Try again later?");
    alert(_id);
});
