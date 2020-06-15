const socket = io();
const {name, room}=Qs.parse(location.search, {ignoreQueryPrefix: true});
console.log(Qs.parse(location.search, {ignoreQueryPrefix: true}));


//Copy the room id to clipboard when the "Copy Link" button is clicked.
const $copylink = document.getElementById('copy-link');
const _id = sessionStorage.getItem('id');
$copylink.addEventListener("click", (e) => {
    let $temp = $("<input>");
    $("#room-details").append($temp);
    $temp.val(_id).select();
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

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = $messageFormInput.value;
    socket.emit('sendMessage', message, _id, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }

    });
})

socket.emit('join',{name, room:_id}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
    console.log('Client joined to socket server.')
})

