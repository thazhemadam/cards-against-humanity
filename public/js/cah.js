const socket = io()

socket.on('welcomeEvent',()=>{
    console.log('hello')
})

const $roomJoin = document.getElementById("roomJoin")
const $playCAH = document.getElementById('CAH')
if($roomJoin)
{$roomJoin.addEventListener("click", (e)=>{
    socket.emit('join','room joined.')
})
}
if($playCAH){
$playCAH.addEventListener("click", (e)=>{
    socket.emit('join','Cah Initialized.')
})}