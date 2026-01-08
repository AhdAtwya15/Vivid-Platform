"use client"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import useConvexQuery, { useConvexMutation } from "@/hooks/useConvexQueryHook"
import { useUser } from "@clerk/nextjs"
import { Loader, Sparkle, TrendingUp, UserPlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useInView } from "react-intersection-observer";
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarLoader } from "react-spinners"
import PostCard from "@/components/posts/postCard"

const FeedPage = () => {
    const {user:myAuthAcc}=useUser();
    const [activeTab,setActiveTab]=useState<"feed"|"trending">("feed")

    const { ref:loadMoreRef } = useInView({
        threshold: 0,
        rootMargin: "100px",
    });
    const {data:feedData,isLoading:isfeedLoading}=useConvexQuery(api.feed.getFeed,{limit:20})
    const feedPosts=feedData?.posts||[]
    console.log(feedPosts)
    const {data:trendingPosts,isLoading:isTrendingLoading}=useConvexQuery(api.feed.getTrendingPosts,{limit:20})

    const {data:suggestedUsers,isLoading:isSuggestedUsersLoading}=useConvexQuery(api.feed.getSuggestedUsers,{limit:6})

    const {mutate:toggleFollow}=useConvexMutation(api.follows.toggleFollow)

    const handleFollowToggle=async(userId:Id<"users">)=>{
     try {
      await toggleFollow({followingId:userId})
    } catch (error) {
      const msg=error instanceof Error ? error.message : "Unknown error"
      toast.error(msg||"Failed to update follow status")
    }
  }


  const getCurrentPosts=():typeof feedPosts=>{
    if(activeTab==="feed") return feedPosts 
    return trendingPosts||[]
  }

  const isLoading=isfeedLoading||(activeTab==="trending"&&isTrendingLoading)
  
  const posts=getCurrentPosts()

    
  return (
    <div className="min-h-screen text-gray-700 dark:text-white dark:bg-linear-to-br from-emerald-950/50 via-emerald-900/50 to-black/10">
        <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
            <div className="text-center mt-25 mb-10 space-y-1">
                <h1 className="text-5xl font-bold bg-linear-to-br from-emerald-950 dark:from-emerald-200 via-emerald-900 dark:via-emerald-100 to-black/50 dark:to-emerald-100/50  text-transparent bg-clip-text">
                    Discover Amazing Content
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-300">
                    Connect with like-minded individuals and discover new interests.

                </p>

            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex gap-3">
                        <Button className="flex-1"
                        onClick={()=>setActiveTab("feed")}
                        variant={activeTab==="feed" ? "primary" : "secondary"}>
                            For You

                        </Button> 
                        <Button className="flex-1 flex items-center gap-2"
                        onClick={()=>setActiveTab("trending")}
                        variant={activeTab==="trending" ? "primary" : "secondary"}>
                            <TrendingUp className="h-4 w-4" />
                            Trending

                        </Button> 

                    </div>

                    {
                        myAuthAcc&&
                        (
                            <Link href="/dashboard/create" className="flex items-center gap-2" >
                                            <div className="relative w-10 h-10 ">
                                                {
                                                    myAuthAcc?.imageUrl?(
                                                        <Image
                                                        src={myAuthAcc.imageUrl}
                                                        alt={myAuthAcc.firstName || "user Photo"}
                                                        fill
                                                        className="object-cover rounded-full border-slate-400"
                                                        
                                                        />
                                                    ):(
                                                    <div className="w-full h-full flex items-center justify-center rounded-full bg-linear-to-br from-emerald-800/5 to-emerald-900/50 text-white text-2xl font-bold">
                                                        {myAuthAcc.firstName?.charAt(0).toUpperCase() || ""}
                                                    </div>
                                                    )
                                                }
                                
                                                </div>
                                                <div className="flex-1">
                                                    <div className=" w-full text-slate-500 dark:text-slate-300  px-8 py-3 bg-gray-100 dark:bg-emerald-900/10 border border-gray-200 dark:border-emerald-900 rounded-full">
                                                         What&apos;s on your mind? Share your thoughts...
                                                    </div>
                                                </div>
                                
                                
                               
                            </Link>

                        )
                    }

                    {
                        isLoading?
                        (
                            <div className="text-center my-10">
                                <BarLoader  width={"100%"} color="#007A55" />
                            </div> 
                        ):posts.length===0?
                        (
                            <Card className="bg-white dark:bg-emerald-950 border-gray-100  dark:border-emerald-900/50">
                                    <CardContent className=" flex flex-col justify-center items-center space-y-4 p-10">
                                        <div className="flex flex-col justify-center items-center space-y-1">
                                            <h3 className="text-2xl font-semibold">
                                                {activeTab === "trending"
                                                    ? "No trending posts right now"
                                                    : "No posts to show"}
                                            </h3>
                                            <p className=" text-slate-500 dark:text-slate-300">
                                                {activeTab === "trending"
                                                    ? "Check back later for trending content"
                                                    : "Follow some creators to see their posts here"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card> 


                        ):
                        (
                            <>
                            <div className="space-y-6">
                                {
                                    posts&&posts.map((post) => (
                                        <PostCard
                                            key={post._id}
                                            post={post}
                                            showAuthor={true}
                                            showOptions={false}
                                            className="max-w-none"
                                        />
                                    ))
                                }

                            </div>
                            {
                                activeTab==="feed"&& feedData?.hasMore&&(
                                    <div ref={loadMoreRef} className="text-center my-10">
                                        <BarLoader  width={"100%"} color="#007A55" />
                                    </div>
                                )
                            }
                            </>
                        )
                    }

                  

                </div>
                <div className="lg:col-span-2 space-y-6 mt-7 md:mt-14">
                    <Card className="bg-white dark:bg-emerald-950 border-gray-100  dark:border-emerald-900/50">

                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkle className="h-4 w-4" />
                            Suggested Users
                        </CardTitle>
                    </CardHeader>
                        <CardContent className="  space-y-4 ">
                            {
                                isSuggestedUsersLoading?(
                                    <div className="flex justify-center py-4">
                                        <Loader className="h-4 w-4 text-slate-500 dark:text-slate-400 animate-spin" />
                                    </div>

                                )
                                :!suggestedUsers || suggestedUsers.length === 0 ? (
                                    
                                        <div className="text-center py-4">
                                            <h3 className="text-lg text-slate-500 dark:text-slate-300 font-semibold">
                                                No suggested users
                                            </h3>
                                           
                                        </div>
                                

                                ):(

                                    <div className="space-y-4">
                                        {
                                            suggestedUsers.map((user) => (
                                                <div key={user._id} className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <Link href={`/${user.username}`}>
                                                            <div className="flex items-center gap-3 cursor-pointer">
                                                                 <div className="relative w-8 h-8 ">
                                                {
                                                    user?.imageUrl?(
                                                        <Image
                                                        src={user.imageUrl}
                                                        alt={user.name || "user Photo"}
                                                        fill
                                                        className="object-cover rounded-full border-slate-400"
                                                        
                                                        />
                                                    ):(
                                                    <div className="w-full h-full flex items-center justify-center rounded-full bg-linear-to-br from-emerald-800/5 to-emerald-900/50 text-white text-2xl font-bold">
                                                        {user.name?.charAt(0).toUpperCase() || ""}
                                                    </div>
                                                    )
                                                }
                                
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold">
                                                        {user.name}

                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        @{user.username}
                                                    </p>


                                                </div>

                                                            </div>
                                                        </Link>
                                                        <Button
                                                        onClick={() =>handleFollowToggle(user._id) }
                                                        variant={"outline"} 
                                                        size={"sm"}
                                                        className="flex items-center gap-2"
                                                        >
                                                            <UserPlus className="w-4 h-4" />
                                                            Follow
                                                        </Button>
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 pl-10">
                                                        {user.followerCount} followers • {user.postCount} posts
                                                    </div>        
                                                    {
                                                        user.recentPosts&&user.recentPosts.length>0&&(
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 pl-10">
                                                                Latest : &quot;{user.recentPosts[0].title.substring(0,30)}...&quot;
                                                            </div>    

                                                        )
                                                    }

                                                </div>    
                                            ))
                                        }

                                    </div>
                                )
                            }
                        </CardContent>
                    </Card> 


                </div>


            </div>



        </div>

    </div>
  )
}

export default FeedPage