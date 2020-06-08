console.log("This is the host page");


//getRoomID will return the room ID.
const url = "/host?roomname=jacoobie"
const getRoomID = async () => {
    return await fetch(url).then(async (response) =>{
        return await response.json().then((data)=> (data.roomid))
    })
}

//Make a request to the page
const hostReq = async () => {
    const _id = await getRoomID();
    // console.log(_id);
}
hostReq();