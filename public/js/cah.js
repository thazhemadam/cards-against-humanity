const socket = io();
const {name, id}=Qs.parse(location.search, {ignoreQueryPrefix: true});
console.log(Qs.parse(location.search, {ignoreQueryPrefix: true}));
console.log(document.referrer);

if(document.referrer===`http://${window.location.host}/html/host.html`){
    socket.emit('create', {name, id}, (err)=>{
        if(err){
            alert(err);
            window.location.href="/";
        }
    });
}

else if(document.referrer===`http://${window.location.host}/html/join.html`){
    socket.emit('login', {name, id}, (err)=>{
        if(err){
            alert(err);
            window.location.href="/html/join.html";
        }
    });
}

else{
    socket.emit('invalid', {}, ()=>{
        alert(window.location.host);
        window.location.href="/";
    });
}

socket.on('broadcast', ({})=>window.location.href="/");

// Copy the room id to clipboard when the "Copy Link button is clicked."
const $copylink = document.getElementById('copy-link');
$copylink.addEventListener("click", () => {
    let $temp = $("<input>");
    $("#room-details").append($temp);
    $temp.val(id).select();
    document.execCommand("copy");
    $temp.remove();
});