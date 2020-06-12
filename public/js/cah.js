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

// const $messageForm = document.getElementById('message-form')
// const $messageFormInput = $messageForm.querySelector('input')
// const $messageFormButton = $messageForm.querySelector('button')
// const $messagesTemplateArea = document.getElementById('messageTemplateArea')
// const $sidebarTemplateArea = document.getElementById('sidebarTemplateArea')

//Templates
// const messageTemplate = document.getElementById('message-template').innerHTML
// const sidebarTemplate = document.getElementById('sidebar-template').innerHTML


console.log(document.referrer);

window.addEventListener('load', ()=>{
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
    
    else{socket.emit('invalid', {}, ()=>window.location.href="/");}
});

document.getElementById('messageBar').addEventListener('submit', (e)=>{
    e.preventDefault();
    let message=e.target.elements.messageInput.value;
    socket.emit('sendMessage', {
        message: message,
        name: name,
        roomname: id
    });
    e.target.elements.messageInput.value="";
    e.target.elements.messageInput.focus();

});

document.getElementById('logout').addEventListener('click', ()=>window.location.href="/");

socket.on('broadcast', ({})=>window.location.href="/");

socket.on('createToastClient', ({roomname})=>{
    let div=document.createElement('div');
    div.classList.add('toast');
    div.textContent=`You created the room ${roomname}`;
    document.getElementById('feed').appendChild(div);
});

socket.on('createToastOthers', ({name, roomname})=>{
    let div1=document.createElement('div');
    div1.classList.add('toast');
    div1.textContent=`${name} created the room ${roomname}`;
    document.getElementById('feed').appendChild(div1);

    let div2=document.createElement('div');
    div2.classList.add('toast');
    div2.textContent=`You joined the room ${roomname}`;
    document.getElementById('feed').appendChild(div2);
});

socket.on('createToastWelcome', ({name})=>{
    let div=document.createElement('div');
    div.classList.add('toast');
    div.style.top=document.getElementById('feed').querySelectorAll('div.message').length>0?"4%":"2%";
    div.textContent=`${name} joined the room`;
    document.getElementById('feed').appendChild(div);
});

socket.on('memberList', ({users})=>{
    document.getElementById('memberList').innerHTML=`<div class="member" style="background-color: rgb(243, 243, 243);">Members</div>`;
    users.forEach(user => {
        let member=document.createElement('div');
        member.classList.add('member');
        member.textContent=user.name;
        document.getElementById('memberList').appendChild(member);
    });
});

socket.on('message', ({message, name})=>{
    let div=document.createElement('div');
    div.classList.add('message');

    let nameSpan=document.createElement('span');
    nameSpan.classList.add('name');
    nameSpan.textContent=name;
    div.appendChild(nameSpan);

    let messageSpan=document.createElement('span');
    messageSpan.textContent=message;
    div.appendChild(messageSpan);

    document.getElementById('feed').appendChild(div);
    document.getElementById('feed').scrollTop=document.getElementById('feed').scrollHeight;
});

socket.on('userLeft', ({name})=>{
    let div=document.createElement('div');
    div.classList.add('toast');
    div.style.top=document.getElementById('feed').querySelectorAll('div.message').length>0?"4%":"2%";
    div.textContent=`${name} left the room`;
    document.getElementById('feed').appendChild(div);
});