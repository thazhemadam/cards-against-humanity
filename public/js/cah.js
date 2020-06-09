const socket = io();
const {name, id}=Qs.parse(location.search, {ignoreQueryPrefix: true});
console.log(Qs.parse(location.search, {ignoreQueryPrefix: true}));

socket.emit('create', {name, id}, (err)=>{
    if(err){
        alert(err);
        window.location.href="/";
    }
});