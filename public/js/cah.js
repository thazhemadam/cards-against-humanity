const socket = io();
const {name, room}=Qs.parse(location.search, {ignoreQueryPrefix: true});
console.log((Qs.parse(location.search, {ignoreQueryPrefix: true})));


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

const autoscroll = () => {
    //New message element
    const $newMessage = $messagesTemplateArea.lastElementChild

    //Height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible Height
    const visibleHeight = $messagesTemplateArea.offsetHeight

    //Height of messages container
    const containerHeight = $messagesTemplateArea.scrollHeight

    //How far have you scrolled?
    const scrollOffset = $messagesTemplateArea.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight<=scrollOffset){
        $messagesTemplateArea.scrollTop = $messagesTemplateArea.scrollHeight
    }
}


$messageForm.addEventListener('submit',(e)=>{

    e.preventDefault()
     
    $messageFormButton.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value
    if(message === ''){
        $messageFormButton.removeAttribute('disabled')
        return console.log('Please enter a message.')
    }

    socket.emit('sendMessage', message, (error)=>{
    
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            console.log(error)
        }
    })
})

socket.emit('join',{name, room:_id}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
    console.log('Client joined to socket server.')
})

socket.on('roomData',({roomName, usersInRoom})=>{
    const html = Mustache.render(sidebarTemplate, {
        roomName,
        usersInRoom
    })
    $sidebarTemplateArea.innerHTML = html

})


socket.on('message',(message, sender)=>{
    const html = Mustache.render(messageTemplate,{
                                                    chat_message: true,
                                                    User: sender,
                                                    messageTime: moment(message.createdAt).format('h:mm a'),
                                                    messageDisplay:message.content
                                                })
    $messagesTemplateArea.insertAdjacentHTML('beforeend',html)
    autoscroll()
}) 

socket.on('toast',(toast)=>{
    const html = Mustache.render(messageTemplate,{
                                                    chat_toast: true,
                                                    toastDisplay: toast
                                                })
    $messagesTemplateArea.insertAdjacentHTML('beforeend',html)
    // autoscroll()
}) 