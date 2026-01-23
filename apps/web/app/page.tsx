"use client";
import PopToggle from "@/components/custom/pop-toggle";
import { useSocket } from "@/hooks/get-socket";
import { Input } from "@workspace/ui/components/input";
import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";
const randomName: string[] = ["Alpaca", "Alpaca", "Pangolin", " Kakapo"];

function generateUserName(value: number) {
  const first = randomName[Math.floor(Math.random() * randomName.length)];
  const last = nanoid(value);
  const result = first + "-" + last;
  return result;
}

export default function Page() {
  const { socket } = useSocket("ws://localhost:8080");
  const [message, setMessage] = useState([""]);
  const roomIdRef = useRef<HTMLInputElement | null>(null)
  const [userId, setUserId] = useState<string | null>(null);
  const [isDisable , setIsDisable] = useState(false)

  useEffect(() => {
    const storedId = localStorage.getItem("user_id");
    if (storedId == null) {
      console.log("run at one")
      const newUserId = generateUserName(10);
      localStorage.setItem("user_id", newUserId);
      setUserId(newUserId);
    }else{ 
       setUserId(storedId);
    }
  }, [userId]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      console.log("data: ", event.data);
      setMessage((m) => [...m, event.data]);
    };
  }, [socket]);

  function handleSendMessage() {
    console.log("click ");
    const parseMessage = JSON.stringify({
      type: "chat",
      payload: {
        message: "hi there",
      },
    });
    socket?.send(parseMessage);
  }

  console.log("all user message: ", message);

  return (
    <div className="max-w-6xl flex items-center justify-center w-full mx-auto h-full min-h-screen">
         <div className="relative flex flex-col gap-5 border-gray-400/30 rounded-md p-6">
              <h1 className="text-xl"> <span className="bg-amber-600/90 px-2">{">"}</span> this chat never existed 👀 </h1>
              <Input disabled className="w-full rounded-md text-neutral-400" defaultValue={userId || "...."} type="text"></Input>
              <div className="flex gap-5 w-full justify-center">
                  <Input onChange={(e) => {
                      setIsDisable(String(e.target.value).length > 0)
                  }} ref={roomIdRef} className="rounded-md" type="text" placeholder="Enter Id Here"></Input>
                  <PopToggle disable={!isDisable} socket={socket} userId={userId} roomIdRef={roomIdRef} />
              </div>
         </div>
    </div>
  );
}
