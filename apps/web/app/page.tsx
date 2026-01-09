"use client";
import { useSocket } from "@/hooks/get-socket";
import { Button } from "@workspace/ui/components/button";
import { useEffect, useRef, useState } from "react";

interface Message {
  room: string | number;
  name: string;
}

export default function Page() {
  const { socket, connect } = useSocket("ws://localhost:8080");
  const [message, setMessage] = useState(["hi there"]);
  const nameRef = useRef<HTMLInputElement>(null);
  const roomId = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      console.log(event.data);
      setMessage((m) => [...m, event.data]);
    };

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "join",
          payload: {
            name: "john",
            roomId: 123,
          },
        })
      );
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
    <div className="flex items-center justify-center min-h-svh">
      <input ref={nameRef} type="text" placeholder="enter your name" />
      <input type="text" ref={roomId} placeholder="roomId" />

      <Button onClick={() => handleSendMessage()} variant={"ghost"}>
        send
      </Button>

      {message}
    </div>
  );
}
