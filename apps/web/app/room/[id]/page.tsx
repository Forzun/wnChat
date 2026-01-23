"use client"

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Coins, Copy, ImageUp, Send, Trash } from "lucide-react"
import Image from "next/image";
import { useState } from "react"

interface Message { 
    text: string, 
    image?: string, 
    isOwn?: boolean, 
    timestamp: Date;
}

export default function Page(){ 
    const [messages , setMesasges] = useState<Message[]>([
        {
            text: "hi", 
            timestamp: new Date()
        },
    ]);
    const [image ,setImage] = useState("")


    function handleFileSelection(event:any){ 
        console.log("here is the event:", event)
        if (event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
            console.log("what happen to image:", image)
          }
    }

    return <div className="flex flex-col min-h-screen bg-background">

        <header className="border-b border-neutral-600/50 top-0 sticky z-50">
            <div className="flex  justify-between py-3 px-10 w-full">
                <div className="flex flex-col gap-1">
                    <h1 className="text-lg">ROOM{">"}ID</h1>
                    <div className="flex gap-3 text-sm items-center">
                        <p>fjsdklfjasdklfjasljfa_</p>
                        <Copy className="w-4 h-4 cursor-pointer text-neutral-400 " />
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="">Self-Destruct</h1>
                    <p>10:00</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="py-3 flex gap-2 items-center justify-center px-6 rounded group cursor-pointer border bg-primary">
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
                                    {message.text && <p className="wrap-break-word text-sm leading-normal tracking-tight text-neutral-400">{message.text}</p>}
                                </div>
                                <span className="text-xs text-muted-foreground ml-2">
                                    {message.timestamp.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                    })}
                                </span>
                            </div>
                        </div> 
                    ))
                ) }
            </div>
        </main>


        <div className="p-5 sticky bottom-0 md:min-w-3xl flex flex-col gap-5 mx-auto">
                <div className="flex-1 flex flex-col md:px-11 px-4">
                    {image ? <Image width={500} height={500} alt="preview image" className="max-w-xs p-3" src={image} /> : ""}
                </div>
                
                <div className="flex items-center gap-3 md:px-7">
                    <span className="md:text-3xl text-2xl shrink-0 text-primary">{"<"}</span>
                    <Input placeholder="Type message..." className="px-4 py-6 rounded-md" />
                    <div className="flex shrink-0 gap-2">
                        <Input onChange={handleFileSelection} className="py-6 w-10" type="file" />
                        <Button className="py-6" ><span className="md:block hidden"><Send /> </span> Send</Button>
                    </div>
                </div>
        </div>

    </div>
}
