"use client"
//nav
import { useStoreUserHook } from "@/hooks/useStoreUserHook"
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Authenticated, Unauthenticated } from "convex/react"
import Link from "next/link"
import {BarLoader} from "react-spinners"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
import { LayoutDashboard } from "lucide-react"

const Navbar = () => {
  const {isLoading,isAuthenticated}=useStoreUserHook()
  const path=usePathname()

  return (
    <header className="fixed top-5 px-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl">
        <div className="flex justify-between items-center gap-2 backdrop-blur-xl bg-[#e8e8e8] dark:bg-white/30 rounded-full py-3 px-4 sm:px-6 md:px-8 ">
        <Link href={isAuthenticated?"/feed":"/"} className="shrink-0">
        <Image
          src="/vividLogo.png"
          alt="Vivid logo"
          width={100}
          height={40}
          className="h-6 sm:h-8 w-auto object-contain"
        />
        </Link>

   { path==="/" &&
   <div className="hidden lg:flex flex-1 justify-center space-x-4">
    <Link href="#features" className="font-medium hover:text-[#335833] dark:hover:text-[#0f330e]  transition-all duration-300 cursor-pointer">
      Features
    </Link>
    <Link href="testimonials" className="font-medium hover:text-[#335833] dark:hover:text-[#0f330e]  transition-all duration-300 cursor-pointer">
      Testimonials
    </Link>

    </div>

   }

   

    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      <Authenticated>
        <Link href={"/dashboard"}>
        <Button variant={"outline"} size={"sm"} className="hidden sm:flex justify-center items-center">
         <LayoutDashboard className="h-4 w-4"/>
         <span className="hidden md:inline">Dashboard</span>         
        </Button>

        </Link>
        <UserButton />
      </Authenticated>

      <Unauthenticated>
      <SignInButton >
        <Button variant={"ghost"} size={"sm"}>
          Sign In                
        </Button>
      </SignInButton>
      <SignUpButton>
        <Button variant={"primary"} size={"sm"}>
          Get Started                
        </Button>
      </SignUpButton>
    </Unauthenticated>
    </div>
   
 

  

    {
      isLoading&&
      <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center">
        <BarLoader width={"90%"} color="#0f330e" />
      </div>
    }

        </div>

       
       

    </header>

    
  )
}

export default Navbar