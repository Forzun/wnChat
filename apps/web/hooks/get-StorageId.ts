import { useEffect, useState } from "react";


export function useStorage(){
    const [localId , setLocalId] = useState<string>();

    useEffect(() => {
        const id = localStorage.getItem("user_id");
        if(id){
            setLocalId(id);
        }
    },[])
    

    return {localId , setLocalId}
}



