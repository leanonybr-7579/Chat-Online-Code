const button = document.querySelector("#container button")
const input = document.querySelector("#container input")
const box = document.querySelector("#container #box")
const socks = new WebSocket("ws://localhost:80")
const name = prompt('Name or nickname: ')
const whiteSpaces = ['']
var alredyUseYou = false
let CanIUseName = true

function createElementFunc(content, text){

    const p = document.createElement('p')
    p.style.fontSize= "18px"
    p.style.position= "relative"
    p.style.top= "15px"
    p.style.left= "20px"
    p.style.maxHeight= '4.4em';
    p.style.width= "590px"
    p.style.height= "1cm"
    p.style.fontFamily= "sans-serif"
    p.style.wordspacing = '0.3em';
    p.style.lineHeight = 1.4
    p.innerHTML += text

    content.appendChild(p)
}

for(let i = 1; i<=1000; i++){
    whiteSpaces.push(' '.repeat(i))
    /*if(name.includes(whiteSpaces[i])){
        alert('Não use nome com espaços em branco!')
        location.reload()
        CanIUseName = false
    }*/
}

if(name === null){
    alert('Do not click on cancel!')
    location.reload()
    CanIUseName = false
}


if(whiteSpaces.includes(name)){
    alert('Dont use white spaces as your name!')
    location.reload()
    CanIUseName = false
}

if(name.length <3 || name.length > 25){
    alert('Max: 25; Min: 3!')
    location.reload()
    CanIUseName = false
}

socks.onopen = () => {
    if(CanIUseName === true)
    {
        socks.send(JSON.stringify({
            type: 'name',
            name: name,
            data: ' has joined on server!'
        }))
    }
}

socks.onmessage = (msg) => {
    msg = JSON.parse(msg.data)
    if(msg.type === 'name'){

        box.scrollTop += 56

        createElementFunc(box, msg.name + msg.data + '<br><br>')

        box.lastChild.scrollIntoView();

    }else if(msg.type === 'message' && alredyUseYou === false){

        box.scrollTop = box.scrollHeight

        createElementFunc(box, (msg.name + ': ' +  msg.data + '<br><br>'))

        box.lastChild.scrollIntoView();

    }else if(msg.type === 'message' && alredyUseYou === true){

        alredyUseYou = false

        box.scrollTop = box.scrollHeight

        createElementFunc(box, ('Você(' + name + '): ' + msg.data + '<br><br>'))

        box.lastChild.scrollIntoView();

    }else if(msg.type === 'ServerMessages'){

        box.scrollTop = box.scrollHeight

        for(let i in msg.data){
            createElementFunc(box, msg.data[i])
        }

        box.lastChild.scrollIntoView();

    }else if(msg.type === 'left-message'){
        createElementFunc(box, (msg.name + msg.data + '<br><br>'))

        box.scrollTop = box.scrollHeight

        box.lastChild.scrollIntoView();

    }
}

button.addEventListener('click', function(){
    if(whiteSpaces.includes(input.value)){
        return
    }else{
        socks.send(JSON.stringify({
            type: 'message',
            name: name,
            data: input.value
        }))

        alredyUseYou = true
        input.value = ''
    }
})

input.onkeyup = function(key){
    if(key.keyCode === 13){
        key.preventDefault()

        button.click()
    }
}
