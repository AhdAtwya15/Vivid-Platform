"use client"

import PostCard from "@/components/posts/postCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { api } from "@/convex/_generated/api"
import useConvexQuery from "@/hooks/useConvexQueryHook"
import { IPost } from "@/interfaces"
import { SelectValue } from "@radix-ui/react-select"
import { CirclePlus, FileText, Filter, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import  { useMemo } from "react"
import { useState } from "react"
import { BarLoader } from "react-spinners"

const MyPostsPage = () => {
  const[searchQuery, setSearchQuery]=useState("")
  const[filterStatus, setFilterStatus]=useState("all")
  const[filterSorting, setFilterSorting]=useState("newest")
  const router = useRouter()

    const{data:posts, isLoading}=useConvexQuery(api.posts.getUserPosts, {})

   

    const filteredPosts=useMemo(()=>{
      if(!posts) return []

      const filtered = posts.filter((post) => {
        const isMatchingSearch = searchQuery === "" || post.title.toLowerCase().includes(searchQuery.toLowerCase())
        const isMatchingStatus = filterStatus === "all" || post.status === filterStatus
        return isMatchingSearch && isMatchingStatus
      });

      filtered.sort((a, b) => {
        switch (filterSorting){
          case "newest":
            return b.createdAt - a.createdAt
          case "oldest":
            return a.createdAt - b.createdAt
          case "mostViews":
            return b.viewCount - a.viewCount
          case "mostLikes":
            return b.likeCount - a.likeCount
          case "alphabetical":
            return a.title.localeCompare(b.title)
          default:
            return b.createdAt - a.createdAt
        }
      });

      return filtered

    },[posts, searchQuery, filterStatus, filterSorting])

    const onEditPost=(post:IPost)=>{
      router.push(`/dashboard/posts/edit/${post._id}`)
    }

    
    if(isLoading) return  <BarLoader width={"100%"} color="#007A55"/>
  return (
    <div className="p-4 lg:p-10 space-y-5">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center  gap-5">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold">My Posts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View and manage your posts.</p>
        </div>
        <Link href={"/dashboard/create"}>
          <Button variant={"primary"} className="flex items-center gap-2">
            <CirclePlus className="w-4 h-4" />
            Create New Post
          </Button>
        </Link>
        
      </header>
      <div>
        <Card className="bg-white dark:bg-emerald-950 border-gray-100  dark:border-emerald-900/50   w-full ">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute inset-y-2.5 left-4 w-4 h-4  text-slate-500 dark:text-slate-400" />
                <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-10 focus:outline-none! focus:ring-! focus:ring-gray-300! dark:focus:ring-emerald-800! focus:border-transparent!"
                type="text"
                />

              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40" >
                  <Filter className="w-4 h-4 text-slate-400" />
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statues</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSorting} onValueChange={setFilterSorting}>
                <SelectTrigger className="w-full md:w-40" >
                  <Filter className="w-4 h-4 text-slate-400" />
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="mostViews">Most Views</SelectItem>
                  <SelectItem value="mostLikes">Most Likes</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>

            </div>
            
          </CardContent>
        </Card>
      </div>
      {
        filteredPosts.length === 0 ? (
          <Card className="bg-white dark:bg-emerald-950 border-gray-100  dark:border-emerald-900/50">
            <CardContent className=" flex flex-col justify-center items-center space-y-4 p-10">
              <FileText className="w-13 h-13 text-slate-400"/>
             <div className="flex flex-col justify-center items-center space-y-1">
               <h3 className="text-lg font-semibold">
                {
                  searchQuery || filterStatus !== "all" ? "No posts found" : "No posts yet"
                }
              </h3>
              <p className=" text-slate-500 dark:text-slate-400">
                {
                  searchQuery || filterStatus !== "all" ? "Try adjusting your search or filters" : "Create your first post to get started"
                }
              </p>
             </div>
              {
                !searchQuery&& filterStatus ==="all" && (
                  <Link href={"/dashboard/create"}>
                    <Button variant={"primary"} className="flex items-center gap-2">
                      <CirclePlus className="w-4 h-4" />
                      Create your first post now !
                    </Button>
                  </Link>
                )
              }
            </CardContent>
            
          </Card> 
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredPosts.map((post) => (
              <PostCard
              key={post._id}
              post={post}
              showOptions={true}
             
              onEdit={onEditPost}/>
            ))}
          </div> 
        )
      }

    </div>
  )
}

export default MyPostsPage