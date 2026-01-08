import { useEffect, useState } from "react";

export default function MouseMoving() {

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
      useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
          setMousePosition({ x: e.clientX, y: e.clientY });
        };
    
        window.addEventListener("mousemove", handleMouseMove);
        
        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
        };
      }, []);
    
  return (
    <div>
         <div className="fixed w-94 h-94 rounded-full blur-3xl pointer-events-none
    bg-linear-to-r from-emerald-300/20 to-emerald-100/10
    dark:from-emerald-950/50 dark:to-emerald-700/50
    transition-transform duration-300 ease-out"
      style={{
        left:mousePosition.x-90,
        top:mousePosition.y-90,
       
      }}>

      </div>
      
    </div>
  )
}
