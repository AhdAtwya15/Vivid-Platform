"use client"

import PostCard from "@/components/posts/postCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import PublicHeader from "@/components/username/publicHeader"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import useConvexQuery, { useConvexMutation } from "@/hooks/useConvexQueryHook"
import { IPost } from "@/interfaces"
import { useUser } from "@clerk/nextjs"

import { Calendar, UserCheck, UserPlus } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import React from "react"
import { CircleLoader } from "react-spinners"
import { toast } from "sonner"

interface IProps
{
    params:Promise<{ username: string }>

}

const ProfilePage = ({params}:IProps) => {
    const {username}=React.use(params)
    const {user:isAuth}=useUser()
    const { data:myAcc } =
  useConvexQuery(api.users.getCurrentuser, isAuth ? {} : "skip");

    const{data:userData,isLoading:isUserLoading,error:isUserError}=useConvexQuery(api.users.getByUsername, {username})
    const {data:postsData,isLoading:isPostsLoading}=useConvexQuery(api.public.getPublishedPostsByUsername, {username,limit:20})
    const posts:IPost[]= postsData?.posts||[]
    console.log("my account",myAcc)

    const{data:isFollowing}=useConvexQuery(api.follows.isFollowing,myAcc&&userData? {followingId:userData._id}:"skip")

    const {data:followersCount}=useConvexQuery(api.follows.getFollowerCount,userData? {userId:userData._id}:"skip")

     const {mutate:toogleFollow,isLoading:isToogleFollowLoading} = useConvexMutation(api.follows.toggleFollow)

     const isMyProfile=myAcc&&myAcc.username===userData?.username

     const handleFollowToggle=async()=>{

        if(!isAuth)
        {
            toast.error("Please sign in first")
            return
        }
    try {
      await toogleFollow({followingId:userData?._id||"" as Id<"users">})
    } catch (error) {
      const msg=error instanceof Error ? error.message : "Unknown error"
      toast.error(msg||"Failed to update follow status")
    }
  }
  if(isUserLoading||isPostsLoading)
  {
    return(
        <div className="min-h-screen text-gray-700 dark:text-white dark:bg-linear-to-br from-emerald-950/50 via-emerald-900/50 to-black/10 flex items-center justify-center">
            <div className="text-center">
                <CircleLoader size={60} aria-label="Loading..." color="#007A55" />
                

            </div>

        </div>
    )
  }

  if(isUserError||!userData)
  {
    notFound()
  }




    return (
    <div className="min-h-screen text-gray-700 dark:text-white dark:bg-linear-to-br from-emerald-950/50 via-emerald-900/50 to-black/10">
        <PublicHeader link="/" title="Back to Home" />
        <div className="max-w-7xl mx-auto px-5 py-10">
            <div className="text-center flex flex-col gap-4">
                <div className="relative w-24 h-24 mx-auto">
                {
                    userData?.imageUrl?(
                        <Image
                        src={userData.imageUrl}
                        alt={userData.name||"user Photo"}
                        fill
                        className="object-cover rounded-full border-slate-400"
                        sizes="96px"
                        />
                    ):(
                    <div className="w-full h-full flex items-center justify-center rounded-full bg-linear-to-br from-emerald-800/5 to-emerald-900/50 text-white text-2xl font-bold">
                        {userData.name?.charAt(0).toUpperCase() || ""}
                    </div>
                    )
                }

                </div>
            <h1 className="text-4xl font-bold bg-linear-to-br from-emerald-950 dark:from-emerald-200 via-emerald-900 dark:via-emerald-100 to-black/50 dark:to-emerald-100/50  text-transparent bg-clip-text">
                {userData.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xl">
                @{userData.username}
            </p>
            {
                !isMyProfile&&myAcc&&(
                    <Button variant={isFollowing ? "outline" : "primary"}
                    disabled={isToogleFollowLoading}
                    onClick={handleFollowToggle}
                    className="flex items-center gap-2 max-w-xl mx-auto"
                    >
                        {
                            isFollowing?
                            (
                                <>
                                <UserCheck className="h-4 w-4" />
                                Following
                                </>
                                
                            )
                            :(
                                <>
                                <UserPlus className="h-4 w-4" />
                                Follow
                                </>
                            
                            )
                        }


                    </Button>

                )
                
            }
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="h-4 w-4" />
                Joined{" "}
                {
                    new Date(userData.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                }
            </div>
        </div>
        <div className="flex justify-center items-center gap-7 mt-7">
            <div className="text-center">
                <p className="text-xl font-bold">{posts.length || 0}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Posts</p>

            </div>
            <div className="text-center">
                <p className="text-xl font-bold">{followersCount || 0}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Followers</p>

            </div>

            <div className="text-center">
                <p className="text-xl font-bold">{posts.reduce((total, post) => total + post.viewCount, 0)}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Views</p>

            </div>

            <div className="text-center">
                <p className="text-xl font-bold">{posts.reduce((total, post) => total + post.likeCount, 0)}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Likes</p>
            </div>
        </div>
        <div className="space-y-5 mt-10">
            <h2  className="text-2xl font-bold">
               Recent Posts
            </h2>
            {
                posts.length===0?(
            <Card className="bg-white dark:bg-emerald-950 border-gray-100  dark:border-emerald-900/50">
            <CardContent className=" flex flex-col justify-center items-center space-y-4 p-10">
            
             <div className="flex flex-col justify-center items-center space-y-1">
               <h3 className="text-lg font-semibold">
                No Posts yet
              
              </h3>
              <p className=" text-slate-500 dark:text-slate-400">
                Check back later for new content!
              
              </p>
             </div>
              
            </CardContent>
            
          </Card> 
                    

                ):(
                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {posts.map((post) => (
                                  <PostCard
                                  key={post._id}
                                  post={post}
                                  showOptions={false}
                                  showAuthor={false}
                                  />

                                 
                                ))}
                              </div> 
                    
                )
            }

        </div>
        </div>
    </div>
  )
}

export default ProfilePage