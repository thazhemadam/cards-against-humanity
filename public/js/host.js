//getRoomID will return the UUID RoomID generated.
const getRoomID = async (name) => {
    const url = "/host?roomname="+name
    return await fetch(url).then(async (response) =>{
        return await response.json().then((data)=> (data.error?false:data.roomName));
    });
}


$hostRoom = document.getElementById('host-room');
$hostRoom.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const $name=document.getElementById('host-name').value.trim();    //host-name
    let roomName=document.getElementById('room-name').value.trim(); //room-name
    const _id = await getRoomID($name).then((data)=>(data)).catch(err=>console.log(err));
    //if _id has been generated, the name, and room are detailed in the URL
    sessionStorage.setItem('id',_id)
    _id?location.replace("/html/room.html?name="+$name+"&room="+roomName):alert("Sorry. Looks like something went wrong. Try again later?");
    alert(_id);
});
