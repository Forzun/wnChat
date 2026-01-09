import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({
    port:8080
})

interface User { 
    socket: WebSocket, 
    name: string, 
    room:string | number
}

let userCount: number = 0; 
let allSocket: User[] = [] 

wss.on("connection", function connection(ws){ 
    console.log("user connected successfuly");

    ws.on("message", function(data: string) { 
        const parsedMessage = JSON.parse(data); 

        if(parsedMessage.type == "join"){ 
            console.log("user join successfully to the room")
            allSocket.push({ 
                socket: ws, 
                name: parsedMessage.payload.name, 
                room: parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type == "chat"){ 

            let currentUserRoom = null;

            allSocket.find(users => { 
                if(users.socket == ws){
                    currentUserRoom = users.room
                }
            }

            for(let i = 0; i<allSocket.length; i++){
                if(allSocket[i]?.room == currentUserRoom){ 
                    allSocket[i]?.socket.send(parsedMessage.payload.message)
                    console.log("all the people with the same room id:", allSocket[i]?.room)
                }
            }

        }
    })
})

