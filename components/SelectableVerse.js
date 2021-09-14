import { useRef,useEffect } from "react";
import Verse from "./Verse";
export default function SelectableVerse (props) {
    const selectionEl = useRef(null);
    useEffect(() =>{
        if(selectionEl.current) {
            const onSelectionChange = (e)=>{
                console.log('selection happened',e);
            };
            selectionEl.current.addEventListener("selectionchange", onSelectionChange);
            return () => selectionEl.current.removeEventListener("selectionchange", onSelectionChange);
        }        
    })
    return (
      <Verse ref={selectionEl}>
          {props.children}
      </Verse>
    )
  }