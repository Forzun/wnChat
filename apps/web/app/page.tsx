"use client";
import { useSocket } from "@/hooks/get-socket";
import { Button } from "@workspace/ui/components/button";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";

interface Message {
  room: string | number;
  name: string;
}

const randomName: string[] = ["Alpaca", "Alpaca", "Pangolin", " Kakapo"];

function generateUserName(value: number) {
  let first = randomName[Math.floor(Math.random() * randomName.length)];
  let last = nanoid(value);
  const result = first + "-" + last;
  return result;
}

export default function Page() {
  const { socket, connect } = useSocket("ws://localhost:8080");
  const [message, setMessage] = useState(["hi"]);
  const nameRef = useRef<HTMLInputElement>(null);
  const [send, setSend] = useState(false);
  const roomId = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
    <div className="flex items-center justify-center min-h-svh">
      <input
        ref={nameRef}
        defaultValue={userId ?? ""}
        type="text"
        placeholder="enter your name"
      />
      <input type="text" ref={roomId} placeholder="roomId" />

      {send ? (
        <Button onClick={() => handleSendMessage()} variant={"ghost"}>
          send
        </Button>
      ) : (
        <Button
          onClick={() => {
            if (!socket) return;

            if (!roomId.current?.value) {
              console.error("please fill room id");
            }

            socket.send(
              JSON.stringify({
                type: "join",
                payload: {
                  name: nameRef.current?.value,
                  roomId: roomId.current?.value,
                },
              })
            );
            setSend(true);
          }}
          variant={"ghost"}
        >
          Join
        </Button>
      )}
      {message.length > 1 && message}
    </div>
  );
}
