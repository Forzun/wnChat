import { useEffect, useState } from "react";


export function useSocket(url: string){
        const [socket , setSocket] = useState<WebSocket | null>(null);
        const [connect , setConnect] = useState(false);
        
        useEffect(() => { 
            const ws = new WebSocket(url);

            ws.onopen = () => { 
                setConnect(true);
            }

            ws.onerror = () => { 
                console.log("WebSocket error");
                setConnect(false);
            }

            ws.onclose = () => { 
                console.log("WebSocket closed");
                setConnect(false);
            }

            setSocket(ws);

            return () => {
                ws.close();
            }
            
        }, [url])

        return { socket , connect}
            
}

