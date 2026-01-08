"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api"
import useConvexQuery from "@/hooks/useConvexQueryHook"
import { ArrowRight } from "lucide-react";
import { BarLoader } from "react-spinners"
import Link from "next/link";
import PostEditor from "@/components/posts/postEditor";

const CreatePostPage = () => {
    const{data:draftingPosts,isLoading:isDraftLoading}=useConvexQuery(api.posts.getUserDraft)
    console.log(draftingPosts)
     const{data:currentUser,isLoading:isCurrentUserLoading}=useConvexQuery(api.users.getCurrentuser)





    if(isDraftLoading||isCurrentUserLoading)
    {
        return <BarLoader  width={"100%"} color="#007A55" />
    }



    if(!currentUser?.username)
    {
        return(
            <div className="p-10 flex justify-center text-center">
                 <div className="space-y-3">
          <h1 className="font-bold text-3xl bg-linear-to-r from-emerald-950 via-emerald-900 to-black/50 text-transparent bg-clip-text dark:text-white">
            Username Required
          </h1>
          <span className="text-gray-700 dark:text-gray-300">
            Set up a username to create and share your posts
          </span>
         <div className="mt-7">
           <Link href="/dashboard/settings">
          <Button variant="primary">
            Set up username
            <ArrowRight className="h-4 w-4 ml-2" />

          </Button>
          </Link>
         </div>
        </div>

            </div>
        )
    }




  return ( <PostEditor initialData={draftingPosts ?? undefined} mode="create" />)
}

export default CreatePostPage