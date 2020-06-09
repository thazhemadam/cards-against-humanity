const socket = io();
const {name, roomid}=Qs.parse(location.search, {ignoreQueryPrefix: true});
console.log(Qs.parse(location.search, {ignoreQueryPrefix: true}));
console.log(document.referrer);

if(document.referrer==="http://localhost:20000/html/host.html"){
    socket.emit('create', {name, roomid}, (err)=>{
        if(err){
            alert(err);
            window.location.href="/";
        }
    });
}