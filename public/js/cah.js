const socket = io();
const {name, id}=Qs.parse(location.search, {ignoreQueryPrefix: true});
console.log(Qs.parse(location.search, {ignoreQueryPrefix: true}));

//Copy the room id to clipboard when the "Copy Link button is clicked."
const $copylink = document.getElementById('copy-link');
$copylink.addEventListener("click", () => {
    let $temp = $("<input>");
    $("#room-details").append($temp);
    $temp.val(id).select();
    document.execCommand("copy");
    $temp.remove();
})

socket.emit('create', {name, id}, (err)=>{
    if(err){
        alert(err);
        window.location.href="/";
    }
});