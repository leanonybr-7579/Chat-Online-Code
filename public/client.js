const socks = io('http://localhost:8080')
const param = new URLSearchParams(window.location.search);
const name = param.get('name');
const textBox = document.querySelector(".box-container .messages-send")
const btn = document.querySelector('.box-container button')
const ipt = document.querySelector('.box-container input')
const typingBox = document.querySelector('.typingBox')
let caniusename = true

if(name === null){
    window.location.href = "file:///Users/ulisses/Desktop/Codes/Test2/server/code.html"
    caniusename = false
}

if(caniusename === true){
    socks.emit('new-user', {
        name: name,
        data: ' has joined the server!<br><br>'
    })
}

btn.addEventListener('click', function(){
    if(ipt.value === ":shutdown"){
        const pass = prompt('Password: ')

        if(pass === 'SAIKOMENE123'){
            socks.emit('shutdown-message')
            return
        }else{
            alert('Permission denied')
            return
        }
    }
    
    socks.emit('chat-message', {
        name: name,
        data: ipt.value
    })

    ipt.value = ''
})

ipt.addEventListener('keyup', function(key){
    if(key.keyCode === 13){
        btn.click()
    }
}) 

ipt.addEventListener('keypress', function(){
    socks.emit('typing-message', {
        name: name
    })
})

socks.on('typing-message', function(things){
    typingBox.style.display = 'block'
    typingBox.innerHTML = '<em>' + things + ' is typing...' + '</em>'
})

socks.on('new-user', function(things){
    textBox.innerHTML += things.name + things.data
    textBox.scrollTop = textBox.scrollHeight
})

socks.on('server-message', function(data){
    textBox.innerHTML = data.allData
    textBox.scrollTop = textBox.scrollHeight
})

socks.on('chat-message', function(data){
    textBox.innerHTML += data.name + ' : ' + data.data + '<br><br>'
    textBox.scrollTop = textBox.scrollHeight
    typingBox.innerHTML = ''
    typingBox.style.display = 'none'
})

socks.on('alert', function(){
    window.location.href = "file:///Users/ulisses/Desktop/Codes/Test2/server/code.html"
})

socks.on('shutdown-message', function(){
    window.location.href = "file:///Users/ulisses/Desktop/Codes/Test2/server/code.html"
})