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

wss.on("connection", function connection(ws: WebSocket){ 
    console.log("user connect successfully")

    ws.on("message", function(data: Buffer | string) { 
        try {
            const rawMessage = data.toString();
            if (rawMessage === "ping") {
                ws.send("pong");
                return;
            }

            const parsedMessage = JSON.parse(rawMessage);

            if(parsedMessage.type == "join"){ 
                console.log("user join successfully to the room")
                allSocket.push({ 
                    socket: ws, 
                    name: parsedMessage.payload.name, 
                    room: parsedMessage.payload.roomId
                })
                console.log(parsedMessage.payload.name  , "has join the room with room id", parsedMessage.payload.roomId , parsedMessage.payload.name)
            }

            if(parsedMessage.type == "chat"){ 

                let currentUserRoom = null;

                allSocket.find(users => { 
                    if(users.socket == ws){
                        currentUserRoom = users.room
                    }
                })

                console.log("all ther current user with room" , currentUserRoom)

                for(let i = 0; i<allSocket.length; i++){
                    if(allSocket[i]?.room == currentUserRoom){ 
                        allSocket[i]?.socket.send(parsedMessage.payload.message)
                        console.log("all the people with the same room id:", allSocket[i]?.room)
                    }
                }

            }
        } catch (error) {
            console.error("Error parsing message:", error);
            ws.send(JSON.stringify({ error: "Invalid message format" }));
        }
    })
})

console.log("server is running at 8080")
