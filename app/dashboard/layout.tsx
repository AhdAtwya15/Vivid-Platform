"use client"
import { ISideBar } from "@/interfaces";
import { FileText, LayoutDashboard, Menu, PenTool, Settings, Users, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/mode-toggle";
import useConvexQuery from "@/hooks/useConvexQueryHook";
import { api } from "@/convex/_generated/api";

interface IProps
{
    children:ReactNode

}

const DashboardLayout = ({children}:IProps) => {
  const [isOpen,setIsOpen]=useState<boolean>(false)
  const pathname=usePathname()
  const{data:darftingPost}=useConvexQuery(api.posts.getUserDraft)
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const sidebarItems:ISideBar[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Post",
    href: "/dashboard/create",
    icon: PenTool,
  },
  {
    title: "My Posts",
    href: "/dashboard/posts",
    icon: FileText,
  },
  {
    title: "Followers",
    href: "/dashboard/followers",
    icon: Users,
  },
];

const toogleSideBar=()=>{
  setIsOpen(!isOpen)
}
  return (
    <div className="min-h-screen text-gray-700 dark:text-white dark:bg-linear-to-br from-emerald-950/50 via-emerald-900/50 to-black/10">

      <aside
      ref={sidebarRef}
      className={cn(
        "fixed top-0 left-0 h-full w-64 bg-linear-to-br from-gray-200/50 to-gray-100/50 dark:bg-linear-to-br dark:from-emerald-950/10 dark:to-emerald-900/50 backdrop-blur-sm border-r border-gray-300 dark:border-gray-600  z-50 transition-all duration-300 lg:translate-x-0 ",
        isOpen ? "translate-x-0":"-translate-x-full"
        
      )}
      
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-300 dark:border-gray-600  ">
          <Link href={"/"} className="shrink-0">
        <Image
          src="https://ik.imagekit.io/7xylxjvvl/vivid/vividLogo.png"
          alt="Vivid logo"
          width={100}
          height={40}
          className="h-6 sm:h-8 w-auto object-contain"
        />
        </Link>
        <Button
        variant={"ghost"}
        size={"icon"}
        onClick={toogleSideBar}
        className="lg:hidden"
        >
          <X className="w-5 h-5 text-gray-700 dark:text-white" />

        </Button>

        </div>
        <nav className="p-5 flex flex-col gap-4">
          { sidebarItems.map((item,index)=>{
          const isActive= pathname===item.href || (item.href!=="/dashboard"&&pathname.startsWith(item.href));

          return(
            <Link key={index} href={item.href} onClick={()=>setIsOpen(false)}>
              <div className={cn(
                "flex  items-center gap-2 p-3 rounded-xl transition-all duration-200 group ",
                isActive?"bg-green-800/30 text-gray-900 dark:text-white":" text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white  hover:bg-gray-200 dark:hover:bg-white/10"
              )

              }>
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-emerald-900":"text-gray-500 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-white"

                  )
                }/>
                <span className="font-medium">
                  {item.title}
                </span>
                {
                  item.title==="Create Post"&& darftingPost &&(
                    <Badge variant={"secondary"} className=" bg-orange-500/20 text-orange-600 dark:text-orange-300 border-orange-500/30 ml-auto">
                      Draft
                    </Badge>
                  )
                }
                

              </div>
            </Link>
          )

        }
      )

        }

        </nav>
        <div className="absolute bottom-4 right-4 left-4 ">
           <div className="  p-5">
                             <ModeToggle />
                          </div>
          <Link href={"/dashboard/settings"}>
          <Button
          variant={"outline"}
          className="flex items-center gap-2 justify-start w-full ">
            <Settings className="h-5 w-5"/>
            Settings
          </Button>
          </Link>

        </div>
      </aside>
       <div className="ml-0 lg:ml-64">
        <header className="fixed w-full top-0 right-0 bg-linear-to-br from-gray-200/50 to-gray-100/50 dark:bg-linear-to-br dark:from-emerald-950/10 dark:to-emerald-900/50 backdrop-blur-sm border-b border-gray-300   dark:border-gray-600 z-30  ">
        <div className="flex justify-between items-center px-4 lg:px-8 py-4">
          <div className="flex items-center">
            <Button
            variant={"ghost"}
            size={"icon"}
            onClick={toogleSideBar}
            className="lg:hidden"
            >
              <Menu className="w-5 h-5 "/>
            </Button>
          </div>
          <div className="h-10 flex items-center ">
            <UserButton/>

          </div>

        </div>

        </header>
        <main className="mt-[73px] ">
          {children}
        </main>

       </div>
    </div>
  )
}

export default DashboardLayout