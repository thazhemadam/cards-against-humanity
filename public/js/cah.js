const socket = io();
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

const $messageForm = document.getElementById('message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messagesTemplateArea = document.getElementById('messageTemplateArea')
const $sidebarTemplateArea = document.getElementById('sidebarTemplateArea')

//Templates
const messageTemplate = document.getElementById('message-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML


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