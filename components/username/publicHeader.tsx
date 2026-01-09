import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";


interface IProps
{

    link:string;
    title:string;
}

const PublicHeader = ({link,title}:IProps) => {
  

  return (
      <header className="sticky w-full top-0 right-0 bg-linear-to-br from-gray-200/50 to-gray-100/50 dark:bg-linear-to-br dark:from-emerald-950/10 dark:to-emerald-900/50 backdrop-blur-sm border-b border-gray-300   dark:border-gray-600 z-30  ">
        
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <Link href={link} >
            <Button variant={"ghost"} size={"sm"} className=" flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white transition-all duration-300">
                <ArrowLeft className="h-4 w-4" />
                {title}
            </Button> 
              
            </Link>
             <Link href="/">
            <Image
            src={"https://ik.imagekit.io/7xylxjvvl/vivid/vividLogo.png"}
            alt="Vivid Logo"
            width={100}
            height={40}
            className="h-6 sm:h-8 w-auto object-contain"
            />

            </Link>
        </div>
      </header>  
  )
}

export default PublicHeader