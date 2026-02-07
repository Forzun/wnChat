import type { Message } from "@workspace/types";
import { createClient } from "redis";
import { WebSocket, WebSocketServer } from "ws";
import { createRoom } from "./redis";

const wss = new WebSocketServer({
    port:8080
})

let userCount: number = 0; 
let allSocket: Message[] = [] 

wss.on("connection", function connection(ws: WebSocket){ 
    console.log("user connect successfully")

    ws.on("message", async function(data: Buffer | string) { 
        try {
            const rawMessage = data.toString();
            if (rawMessage === "ping") {
                ws.send("pong");
                return;
            }
            
            const parsedMessage = JSON.parse(rawMessage);

            if(parsedMessage.type == "join"){ 
                userCount++;
                console.log("user join successfully to the room")
                allSocket.push({ 
                    socket: ws, 
                    name: parsedMessage.payload.name, 
                    room: parsedMessage.payload.roomId
                })
                console.log(parsedMessage.payload.name  , "has join the room with room id", parsedMessage.payload.roomId , parsedMessage.payload.name)
                const redisData = await createRoom(parsedMessage.payload.roomId , parsedMessage.payload.name)

                console.log("redis data here:", redisData)

                if(redisData){
                ws.send(JSON.stringify({
                    type: "room_state", 
                    payload: { 
                        roomId: parsedMessage.payload.room,
                        remainingTime: redisData
                    }
                }))
            }
        
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
                        const data = { 
                            message: parsedMessage.payload.message, 
                            image: parsedMessage.payload.image,
                            name: parsedMessage.payload.name                            
                        }
                        allSocket[i]?.socket.send(JSON.stringify(data))
                        console.log("all the people with the same room id:", allSocket[i]?.room); 
                        console.log("user count", userCount)
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
