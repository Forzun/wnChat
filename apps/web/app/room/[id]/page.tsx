"use client"

import { useStorage } from "@/hooks/get-StorageId";
import { useSocket } from "@/hooks/get-socket";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Copy, Send, Trash, X } from "lucide-react"
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react"

interface Message { 
    message: string, 
    image?: string, 
    isOwn?: boolean, 
    timestamp?: Date;
    name?: string;
}

export default function Page(){ 
    const [input , setInput] = useState('');
    const [messages , setMessage] = useState<Message[]>([]);
    const {userId} = useStorage();
    const [image ,setImage] = useState<string | null>(null)
    const messageRef = useRef<HTMLDivElement | null>(null);
    const {socket , connect} = useSocket("ws://localhost:8080")
    const params = useParams();

    console.log("message object", messages)

    useEffect(() => { 
        if(!socket || !connect){ 
            return;
        }
    socket.send(JSON.stringify({ 
            type:"join", 
            payload:{ 
                name: userId,
                roomId: params.id
            }
        }))

    }, [socket , connect , params.id , userId])

    useEffect(() => {
        if (!socket) return;
      
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            console.log("data being received:", data);
          
            setMessage(prev => [
              ...prev,
              {
                message: data.message,
                image: data.image ?? null,
                name: data.name,
              },
            ]);

        };
      
        return () => {
          socket.onmessage = null;
        };
      }, [socket]);
      

    const scrollToBottom = () => {
        messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    function handleImageSubmit(event:any){ 
        const imageFile = event.target.files[0];

        if(imageFile){ 
            const render = new FileReader();
            render.onload = (e) => { 
                setImage(e.target?.result as string)
            };
            render.readAsDataURL(imageFile)
        }

    }

    function handleMessageSubmit() { 
        if(input.trim() || image){

            socket?.send(JSON.stringify({ 
                type: "chat", 
                payload:{ 
                    message: input,
                    image: image, 
                    name: userId
                }
            }))
            setImage(null);
            setInput('')
        }
    }

    function DownKeyHandler(event: React.KeyboardEvent<HTMLInputElement>){
        if((event.key === 'Enter')){
            handleMessageSubmit();
            event.preventDefault()
        }
    }

    return <div className="flex flex-col min-h-screen bg-background">

        <header className="border-b border-neutral-600/40 top-0 sticky z-50 bg-secondary-foreground">
            <div className="flex  justify-between py-3 px-10 w-full">
                <div className="flex flex-col gap-1">
                    <h1 className="text-lg">ROOM{">"}ID</h1>
                    <div className="flex gap-3 text-sm items-center">
                        <p>{userId}</p>
                        <Copy className="w-4 h-4 cursor-pointer text-neutral-400 " />
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="">Self-Destruct</h1>
                    <p>10:00</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="py-3 flex gap-2 items-center justify-center px-6 rounded group cursor-pointer border bg-primary/70">
                        <Trash className="scale-80 group-hover:animate-[shake_0.55s_ease-in-out_infinite]" /> 
                        <p className="group-hover:text-neutral-300 text-secondary transition-all duration-300 ease-in-out ">Destory</p>
                    </div>
                </div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="space-y-0">
                {messages.length == 0 ? (
                    <div className="flex items-center justify-center min-h-[80vh]">
                        <p className="text-lg tracking-tight text-neutral-400/50">No messages yet, start the conversation.</p>
                    </div>
                ) : (
                    messages.map((message , index) => ( 
                        <div key={index} className="flex items-start gap-2 group py-3 px-3">
                                <div className="text-neutral-400 text-md font-bold pt-2 ">{"<"}</div>
                            <div className="flex flex-col gap-1">
                                <div className="inline-block px-3 md:px-2 py-2 rounded-md border transition-all duration-200 bg-cover border-b-primary/80 cursor-grab shadow-2xl text-shadow-sm text-shadow-primary/10 ring ring-white/10">
                                    {message.image && <div className="h-full w-full relative">
                                        <Image width={500} height={500} alt="preview image" className="max-w-xs mb-2 rounded ring-2 ring-primary/40  p-2" src={message.image} />
                                    </div> }
                                    {message.message && <p className="wrap-break-word text-sm leading-normal tracking-tight text-neutral-400">{message.message}</p>}
                                </div>
                                <span className="text-xs text-muted-foreground ml-2">
                                    {message.name || "Nothing"}
                                    {/* {message.timestamp.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                    })} */}
                                </span>
                            </div>
                        </div> 
                    ))
                )}
            </div>
        </main>


        <div className="p-5 sticky bottom-0 md:min-w-3xl flex flex-col gap-5 mx-auto">
                <div className="flex-1 flex flex-col md:px-11 px-4">
                    {image ? <div className="h-full w-fit relative" >
                        <Image width={500} height={500} alt="preview image" className="max-w-xs rounded ring-2 ring-primary/40  p-2" src={image} /> 
                        <button onClick={() => setImage(null)} className="w-5 h-5 bg-primary rounded-full p-1 absolute top-3 right-3 flex items-center justify-center text-center"><X /></button>
                    </div>: ""}
                </div>
                
                <div className="flex items-center gap-3 md:px-7">
                    <span className="md:text-3xl text-2xl shrink-0 text-primary">{"<"}</span>
                    <Input onKeyDown={DownKeyHandler}  value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type message..." className="px-4 py-6 rounded-md" />
                    <div className="flex shrink-0 gap-2">
                        <Input onChange={handleImageSubmit} className="py-6 w-10" type="file" />
                        <Button disabled={input == ''} onClick={handleMessageSubmit} className="py-6" ><span className="md:block hidden"><Send /> </span> Send</Button>
                    </div>
                </div>
        </div>
        <div ref={messageRef}></div>
    </div>
}

