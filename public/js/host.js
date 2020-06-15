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
    console.log('Beginning to host room.')
    const $name=document.getElementById('host-name').value.trim();    //host-name
    let roomName=document.getElementById('room-name').value.trim(); //room-name
    console.log('Name: '+$name+' Room: '+roomName)
    const _id = await getRoomID(roomName).then((data)=>(data)).catch(err=>console.log(err));
    console.log('ID generated: '+_id)
    //if _id has been generated, the name, and room are detailed in the URL
    sessionStorage.setItem('id',_id)
    _id?location.replace("/html/room.html?name="+$name+"&room="+roomName):alert("Sorry. Looks like something went wrong. Try again later?");
    alert(_id);
});
