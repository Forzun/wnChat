"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

type ThemeValuesType = { 
  name: string
}

const themeValues: ThemeValuesType[] = [
  {
    name: "dark", 
  },
  {
    name: "system",
  },
  {
    name: "light"
  }
]

export default function PopToggle({socket , userId , roomIdRef , disable}: {on?: boolean , userId: string | null , socket: WebSocket | null , roomIdRef: React.RefObject<HTMLInputElement | null> , disable?: boolean}) {
  const router = useRouter()

    if(userId == null){
      return <div>
          Something went wrong...
      </div>
    }

    return(
         <AlertDialog>
            <AlertDialogTrigger asChild>
        <Button disabled={disable}>Continue</Button>
      </AlertDialogTrigger>
        <AlertDialogContent >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-neutral-400">This room only exist for only 10 minutes</AlertDialogTitle>
            <AlertDialogDescription className="flex w-full gap-2 flex-col">
              <Input disabled className="rounded-md text-neutral-400" value={userId} type="text"></Input>
              <CustomToggle themes={themeValues} />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={() => {
                const roomId = roomIdRef.current?.value;
                socket?.send(JSON.stringify({ 
                  type:"join", 
                  payload: { 
                    name: userId, 
                    roomId: roomId
                  }
                }))
                router.push(`room/${roomId}`)
              }} >{"{"}<span>Join</span>{"}"}</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
}


function CustomToggle({themes}: {themes: ThemeValuesType[]}){
  const [activeTheme, setActiveTheme] = useState<string | null>()
  const { setTheme } = useTheme();

  return <span className="relative border flex max-w-64 rounded border-neutral-300 dark:border-neutral-600/60 overflow-hidden">
  {themes.map((theme, index) => {
    const isActive = activeTheme === theme.name

    return (
      <span
        key={index}
        onClick={() => { 
          setActiveTheme(theme.name)
          setTheme(theme.name)
        }}
        className="relative group cursor-pointer w-full flex justify-center py-2"
      >
        <span
          className={`
            absolute inset-0
            transition-all duration-300 ease-in-out
            ${isActive ? "bg-primary opacity-100" : "bg-amber-900/20 opacity-0"}
            group-hover:opacity-100
            z-0
          `}
        />

        <span
          className={`
            relative z-10
            transition-colors duration-300
            ${isActive ? "text-white" : "text-neutral-800"}
            group-hover:text-white
            dark:text-white
          `}
        >
          {theme.name}
        </span>
      </span>
    )
  })}
</span>
}

