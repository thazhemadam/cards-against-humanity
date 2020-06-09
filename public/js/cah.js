const {name, id}=Qs.parse(location.search, {ignoreQueryPrefix: true});
console.log(Qs.parse(location.search, {ignoreQueryPrefix: true}));

//Copy the room id to clipboard when the "Copy Link" button is clicked.
const $copylink = document.getElementById('copy-link');
$copylink.addEventListener("click", (e) => {
    let $temp = $("<input>");
    $("#room-details").append($temp);
    $temp.val(id).select();
    document.execCommand("copy");
    $temp.remove();
});

//Minimizing and maximizing the whole chat-section when Open/Close Chat button is clicked.
$(document).ready(() => {
    $(document).ready(function(){
        $("#chat-toggle").click(function(){
            const show = $(this).val() === 'Close Chat';
            $(this).val(show ? 'Open Chat' : 'Close Chat');
            $("#chat-section").toggle();
        });
    });
  
  });


const socket = io();
console.log(document.referrer);

if(document.referrer==="http://localhost:20000/html/host.html"){
    socket.emit('create', {name, id}, (err)=>{
        if(err){
            alert(err);
            window.location.href="/";
        }
    });
}

else if(document.referrer==="http://localhost:20000/html/join.html"){
    socket.emit('login', {name, id}, (err)=>{
        if(err){
            alert(err);
            window.location.href="/html/join.html";
        }
    });
}

else{
    socket.emit('invalid', {}, ()=>{
        window.location.href="/";
    });
}

socket.on('broadcast', ({})=>window.location.href="/");

socket.emit('create', {name, roomid}, (err)=>{
    if(err){
        alert(err);
        window.location.href="/";
    }
});