"use client"
import UserCard from "@/components/follows/userCard"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import useConvexQuery, { useConvexMutation } from "@/hooks/useConvexQueryHook"
import { IFollowUser } from "@/interfaces"
import { Search } from "lucide-react"
import { useState } from "react"
import { BarLoader } from "react-spinners"
import { toast } from "sonner"

const FollowersPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("")

  const {data:followers, isLoading:isFollowersLoading} =useConvexQuery(api.follows.getMyFollowers, {limit:100}) 
  const {data:following, isLoading:isFollowingLoading} =useConvexQuery(api.follows.getMyFollowing, {limit:100}) 

  const {mutate:toogleFollow} = useConvexMutation(api.follows.toggleFollow)

  const handleFollowToggle=async(userId:Id<"users">)=>{
    try {
      await toogleFollow({followingId:userId})
    } catch (error) {
      const msg=error instanceof Error ? error.message : "Unknown error"
      toast.error(msg||"Failed to update follow status")
    }
  }



  const filterSearch=(users:IFollowUser[])=>{
    if(!searchQuery.trim()) return users||[];

    return (users||[]).filter(
      (user)=>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
  const filteredFollowers=filterSearch(followers||[])
  const filteredFollowing=filterSearch(following||[])

  const isLoading=isFollowersLoading||isFollowingLoading

   if(isLoading)
      {
          return <BarLoader  width={"100%"} color="#007A55" />
      }
  


  return (
     <div className="p-4 lg:p-10 space-y-5">
      <header className="flex flex-col space-y-2" >
          <h1 className="text-2xl lg:text-3xl font-bold">Followers & Following</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your connections and discover new creators</p>
   
      </header>
      <div className="relative ">
                <Search className="absolute inset-y-2.5 left-4 w-4 h-4  text-slate-500 dark:text-slate-400" />
                <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 focus:outline-none! focus:ring-! focus:ring-gray-300! dark:focus:ring-emerald-800! focus:border-transparent!"
                type="text"
                />

              <Tabs defaultValue="followers" className="mt-7">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100  dark:bg-emerald-900/50 ">
                  <TabsTrigger value="followers">
                    Followers ({filteredFollowers.length})
                  </TabsTrigger>
                  <TabsTrigger value="following">
                    Following ({filteredFollowing.length})
                  </TabsTrigger>

                </TabsList>
                <TabsContent value="followers" className="mt-5 space-y-3">
                  {
                    filteredFollowers.map((user) => (
                      <UserCard key={user._id} user={user} variant="follower" onToggleFollow={handleFollowToggle} />
                    ))    
                  }

                </TabsContent>
                <TabsContent value="following" className="mt-5 space-y-3">
                  {
                    filteredFollowing.map((user) => (
                      <UserCard key={user._id} user={user} variant="following" onToggleFollow={handleFollowToggle} />
                    ))    
                  }
                </TabsContent>
              </Tabs>
              </div>

    </div>
  )
}

export default FollowersPage