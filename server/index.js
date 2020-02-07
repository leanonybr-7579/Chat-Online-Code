const server = require("ws").Server
const s = new server({ port: 80 })
let users = 0
let userList = []
let canIUse = false
let allData = []
let userleft = null

s.on('connection', function(ws){
    beforeUser = users;
    users++;
    console.log('There is ' + users +' users')
    ws.on('message', function(msg){
        msg = JSON.parse(msg)
        console.log('Received: ' + msg.name + ' : '+ msg.data)

        if(msg.type === 'name'){
            ws.plrName = msg.name
            userList.push(msg.name)
            allData.push(msg.name + msg.data + '<br>')
            if(users != 1){

                ws.send(JSON.stringify({
                    type: 'ServerMessages',
                    data: allData,
                }))
                canIUse = true
            }
        }else if(msg.type === 'message'){
            allData.push(msg.name + ': ' + msg.data + '<br>')
            canIUse = false
        }

        if(canIUse === false){
            ws.send(JSON.stringify({
                type: msg.type,
                data: msg.data,
                name: msg.name,
            }))
            canIUse = true
        }

        for(let client of s.clients){
            if(client !=  ws){

                client.send(JSON.stringify({
                    type: msg.type,
                    data: msg.data,
                    name: ws.plrName,
                }))
            }
        }
    })

    ws.on('close', function(){
        let place = null
        users--;
        console.log('There is: ' + users + ' users')
        for(let i of s.clients){
            for(let f of userList){
                if(i.plrName != f){
                    place = userList.indexOf(f)
                    userleft = f
                    userList.splice(place)
                    place = null
                    allData.push(i.plrName + ' has left the server!')
                    continue
                }
            }
        }

        for(let client of s.clients){
            if(client !=  ws){

                client.send(JSON.stringify({
                    type: 'left-message',
                    name: 'Server: '+ userleft,
                    data: ' has left the server!',
                }))
            }
        }
    })

})