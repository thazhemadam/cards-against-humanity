console.log('This is the join page');

//url must be created using the form details.
const url = '/join'

const roomJoinStatus = async () => {
    return await fetch(url).then(async (response) =>{
        return await response.json().then((data)=> (data.error?data.error:data.status));
    });
}


const hostReq = async () => {
    const error = await roomJoinStatus();
    console.log(error);
}
hostReq();
