
import { WebSocket } from "ws"

export interface Message{
    socket: WebSocket;
    name?: string, 
    image?: string, 
    message?: string;
    room: string;
}

