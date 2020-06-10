//getRoomID will return the UUID RoomID generated.
const getRoomID = async (name) => {
    const url = "/host?roomname="+name
    return await fetch(url).then(async (response) =>{
        return await response.json().then((data)=> (data.error?false:data._id));
    });
}


$hostRoom = document.getElementById('host-room');
$hostRoom.addEventListener('submit', async (e)=>{
    e.preventDefault();
    $name=document.getElementById('host-name').value.trim();
    let roomName=document.getElementById('room-name').value.trim();
    const _id = await getRoomID($name).then((data)=>(data)).catch(err=>console.log(err));
    console.log(_id);
    _id?location.replace("/html/room.html?name="+$name+"&id="+roomName):alert("Sorry. Looks like something went wrong. Try again later?");
    alert(_id);
});
