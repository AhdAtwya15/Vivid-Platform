import { Id } from "@/convex/_generated/dataModel"
import { IFollowUser } from "@/interfaces"
import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/button"
import { Loader,  UserMinus, UserPlus } from "lucide-react"



interface IProps
{
    user:IFollowUser
    isLoading?:boolean
    variant:"follower" | "following"
    onToggleFollow:(userId:Id<"users"> ) => void


}

const UserCard = ({user,isLoading=false,variant="follower",onToggleFollow}:IProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-emerald-900/50 rounded-lg">

        <div className="flex items-center gap-3">
            <Link href={`/${user.username}`} >
            <div className="relative w-10 h-10 cursor-pointer">
                {
                    user.imageUrl?(
                                                            <Image
                                                            src={user.imageUrl}
                                                            alt={user.name || ""}
                                                            fill
                                                            sizes="32px"
                                                            className="object-cover w-full h-full rounded-full"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center rounded-full bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-500">
                                                                {user.name?.charAt(0).toUpperCase() || ""}
                                                            </div>
                                                        )
                }
            </div>
            </Link>
            <Link href={`/${user?.username || ""}`}>
            <div className="cursor-pointer">
                <p className="font-medium hover:text-emerald-700 transition-colors duration-300">
                    {user.name}

                </p>
                {
                    user.username && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            @{user.username}
                        </p>
                    )   
                }

            </div>
            </Link>
        </div>
        {
            variant==="follower" ? (
                !user.followsBack&&(
                    <Button variant={"outline"}
                    size={"sm"}
                    className="flex items-center gap-2 border-emerald-700 text-emerald-600 hover:bg-emerald-700  hover:text-white transition-all duration-300"
                    disabled={isLoading}
                    onClick={()=>onToggleFollow?.(user._id)}>

                        {
                            isLoading?(
                                <Loader className="w-4 h-4 animate-spin"/>
                            ):(
                                <>
                                <UserPlus className="w-4 h-4"/>
                                Follow Back

                                </>
                            )
                        }


                    </Button>
                )

            ):
            (
                <Button variant={"ghost"} size={"sm"}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400  dark:hover:text-red-400 hover:text-red-400 transition-all duration-300"
                onClick={()=>onToggleFollow?.(user._id)}>
                    {
                        isLoading?
                    (
                        <Loader className="w-4 h-4 animate-spin"/>
                    ):
                    (
                        <>
                        <UserMinus className="w-4 h-4"/>
                        Unfollow
                        </>
                    )
                    }

                </Button>

            )

        }

    </div>
  )
}

export default UserCard