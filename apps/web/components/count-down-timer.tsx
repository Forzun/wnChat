"use client";

import { useEffect, useRef, useState } from "react";


export default function CountDownTimer({remainingSecond}: {remainingSecond: number}){
    const [timeLeft , setTimeLeft] = useState(remainingSecond);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        setTimeLeft(remainingSecond);
    }, [remainingSecond]);

    useEffect(() => { 

        intervalRef.current = setInterval(() => { 
            setTimeLeft((second) => second - 1);
        },1000)

        return () => { 
            if(intervalRef.current !== null) clearInterval(intervalRef.current);
        }
    }, [])

    useEffect(() => { 

        if(timeLeft <= 0 && intervalRef.current  !== null){
            clearInterval(intervalRef.current);
        }

    }, [timeLeft])

    function formatTime(seconds: number) { 
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }


    function getTimeOut() { 
        if (timeLeft > 300) return '#c3c0b6';
        if (timeLeft > 60) return '#fbbf24';
    }

    return <div className="text-center p-1">
        <p className="text-xl" style={{color: getTimeOut()}}>
        {timeLeft > 0 ? formatTime(timeLeft) : 'Timer Complete!'}
        </p>
  </div>
}


