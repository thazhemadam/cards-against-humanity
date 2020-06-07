const socket = io();
const {name, roomid}=Qs.parse(location.search, {ignoreQueryPrefix: true});
console.log(Qs.parse(location.search, {ignoreQueryPrefix: true}));

socket.emit('create', {name, roomid}, (err)=>{
    if(err){
        alert(err);
        window.location.href="/";
    }
});