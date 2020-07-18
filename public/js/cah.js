const _id = sessionStorage.getItem('roomid');
const userid = sessionStorage.getItem('userid');

if(!_id || !userid){
    alert('Oops. Looks like you got lost.');
    window.location.href = '/'
}
else{
    const socket = io();
    const {name, room}=Qs.parse(location.search, {ignoreQueryPrefix: true});
    console.log((Qs.parse(location.search, {ignoreQueryPrefix: true})));


    //Copy the room id to clipboard when the "Copy Link" button is clicked.
    const $copylink = document.getElementById('copy-link');
    const $logout = document.getElementById('logout');
    $copylink.addEventListener("click", (e) => {
        let $temp = $("<input>");
        $("#room-details").append($temp);
        $temp.val(_id).select();
        document.execCommand("copy");
        $temp.remove();
    });

    $logout.addEventListener("click", (e)=> {
        // window.location.href='/';
        sessionStorage.removeItem('roomid');
        sessionStorage.removeItem('userid');
        socket.emit('logout', () => {
            console.log('Logging out - Client.')
            window.location.href = '/'
        })
    });

    const $messageForm = document.getElementById('message-form')
    const $messageFormInput = $messageForm.querySelector('input')
    const $messageFormButton = $messageForm.querySelector('button')
    const $messagesTemplateArea = document.getElementById('messageTemplateArea')

    //Templates
    const messageTemplate = document.getElementById('message-template').innerHTML

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

    let toggler=[...document.getElementById('toggle').querySelectorAll('div')];
    toggler.forEach(item=>{
        item.addEventListener('click', ()=>{
            if(item.textContent===toggler[0].textContent){
                document.getElementById('chat-section').style.zIndex='1';
                document.getElementById('detailsandstats').style.zIndex='5';
            }else if(item.textContent===toggler[1].textContent){
                document.getElementById('chat-section').style.zIndex='5';
                document.getElementById('detailsandstats').style.zIndex='1';
            }
        });
    });

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

// if()
// {
    socket.emit('join',{name, room:_id}, userid, (error)=>{
        if(error){
            alert(error)
            location.href = '/'
        }
        console.log('Client joined to socket server.')
    })

    socket.on('roomData',({roomName, usersInRoom, question, cardCzar})=>{
        const html = Mustache.render(document.getElementById('sidebar-template').innerHTML, {
            roomName,
            usersInRoom
        })
        document.getElementById('detailsandstats').innerHTML = html
        document.getElementById('roomName').textContent=roomName;
        document.getElementById('question').textContent=question;
        document.getElementById('cardCzar').textContent=cardCzar;
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
        autoscroll()
    }) 

    let selectedCard="";

    socket.on('answerCards', ({answers})=>{
        document.getElementById('answerCardsContainer').innerHTML='';

        answers.map(ans=>{
            let div=document.createElement('div');
            div.classList.add('cardContainer');
            let answerCard=document.createElement('div');
            answerCard.classList.add('card');
            answerCard.style.backgroundColor='white';
            answerCard.style.color='black';
            answerCard.textContent=ans;
            div.appendChild(answerCard);
            document.getElementById('answerCardsContainer').appendChild(div);
        });
        
        let answerCards=[...document.querySelectorAll('#answerCardsContainer .cardContainer')];

        if(selectedCard===""){
            answerCards.map(answer=>{
            answer.addEventListener('click', ()=>{
                    answerCards.map(ans=>ans.style.backgroundColor="white");
                    answer.style.backgroundColor="rgb(1, 103, 255)";
                    selectedCard=answer.textContent;
            });
            });
        }
    });

    document.querySelectorAll('.roundInfo button')[1].addEventListener('click', ()=>{
        let answerCards=[...document.querySelectorAll('#answerCardsContainer .cardContainer')];
        let answer=answerCards.find(ans=>ans.textContent===selectedCard);
        if(answer!==undefined && document.getElementById('question').textContent!==''){
            document.getElementById('answerCardsContainer').removeChild(answer);
            let answerCard=answer.textContent;
            answerCards=[...document.querySelectorAll('#answerCardsContainer .cardContainer')];
            let answerTexts=answerCards.map(ans=>ans.textContent);
            let roomName=document.getElementById('roomName').textContent;
            // selectedCard="";
            socket.emit('newAnswerCard', {answerTexts, answerCard, room:_id});
            // socket.emit('submitAnswer', {answer, roomName});
        }else{alert("Choose a card to answer the question");}
    });

    socket.on('submitAnswer', (answerCard)=>{
        let div1=document.createElement('div');
        div1.classList.add('cardContainer');
        let div2=document.createElement('div');
        div2.classList.add('card');
        div2.innerHTML=`<img class="loading" src="../assets/loading.svg" alt="loading"><br/>Waiting for other players`;
        div1.appendChild(div2);
        document.getElementById('submissions').appendChild(div1);
    });

    socket.on('start', (question)=>{
        document.getElementById('startGame').style.visibility="visible";
    });

    document.getElementById('startGame').addEventListener('click', ()=>socket.emit('gameSession', {}));
}