import { useEffect, useState } from "react";


export function useStorage(){
    const [userId , setuserId] = useState<string>();

    useEffect(() => {
        const id = localStorage.getItem("user_id");
        if(id){
            setuserId(id);
        }
    },[])
    

    return {userId , setuserId}
}



