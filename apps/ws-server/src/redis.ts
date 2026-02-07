import { createClient } from "redis";
const client = createClient();

export async function createRoom(roomId:string , userId:string){
    try{ 
        const exist = await client.exists(`room:${roomId}`);
        
        if(!exist){ 
            await client.set(`room:${roomId}`, "active", { EX: 600 });
        }

        await client.sAdd(`room:${roomId}:users`, userId);

        const ttl = await client.ttl(`room:${roomId}`);

        console.log("redis room data",{
            success: true, 
            remainingTime: ttl
        })

        return {
            remainingTime: ttl
        }
    
    }catch(error){
        console.log(error)
    }
}

async function startServer(){ 
    try{
        await client.connect();
        console.log("connected to redis");

    }catch(error){
        console.log("not able to connect to redis");
    }
}

startServer();
