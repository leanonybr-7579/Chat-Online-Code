const express = require('express')
const app = express()

const server = app.listen(8080, function(){
    console.log('Im listening on port 8080')
})

app.use(express.static('public'))

const io = require('socket.io')(server)
let allData = []
let users = 0
let allUsers = []

io.on('connection', (socket) => {
    //console.log('New user joined with the id of ' + socket.id)

    socket.on('new-user', function(data){
        users++

        allData.push(`${data.name}${data.data}`)

        if(allUsers.includes(data.name)){
            socket.emit('alert')
            return
        }

        if(users != 1){
            io.sockets.emit('server-message', {
                allData: allData.join(' ')
            })

            allUsers.push(data.name)
        }else{
            io.sockets.emit('new-user', {
                name: data.name,
                data: data.data
            }) 
            allUsers.push(data.name)
        }
        console.log('Received: ' + data.name + data.data)
    })

    socket.on('chat-message', function(events){
        io.sockets.emit('chat-message',{
            name: events.name,
            data: events.data
        })
    })

    socket.on('shutdown-message', function(){
        io.sockets.emit('shutdown-message')
    })

    socket.on('typing-message', function(things){
        socket.broadcast.emit('typing-message', things.name)
    })
})
