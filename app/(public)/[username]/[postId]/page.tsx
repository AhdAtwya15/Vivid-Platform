"use client"
import PublicHeader from "@/components/username/publicHeader"
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useConvexQuery, { useConvexMutation } from "@/hooks/useConvexQueryHook";
import { useUser } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import Image from "next/image";
import { Calendar, Eye, Heart, Loader, MessageCircle, Send,  Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useWatch } from "react-hook-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface IProps
{
    params: Promise<{
    username: string;
    postId: Id<"posts">;
  }>;

}

interface IComment 
{

  comment: string;
}
  



const PostPage = ({params}: IProps) => {
   const { username, postId } = React.use(params);
     const [deletedComment, setDeletedComment] = useState<Id<"comments">|null>(null)
    const [isDeletedModalOpen, setIsDeletedModalOpen] = useState<boolean>(false);
   


  const { user:myAuthAcc } =useUser()
  const {data:myDbAcc}=useConvexQuery(api.users.getCurrentuser,myAuthAcc?{}:"skip");

  const {data:post,isLoading:isPostsLoading,error:isPostErr}=useConvexQuery(api.public.getPublishedPost, {username,postId})
  console.log("post",post)

  const {data:comments,isLoading:isCommentsLoading}=useConvexQuery(api.comments.getPostComments, {postId})
  console.log("comments",comments)

  const {data:hasUserLiked}=useConvexQuery(api.likes.hasUserLiked, myAuthAcc?{postId}:"skip")
  console.log("hasUserLiked",hasUserLiked)

  const {mutate:toggleLike}=useConvexMutation(api.likes.toggleLike);

  const {mutate:addComment,isLoading:isAddingComment}=useConvexMutation(api.comments.addComment);

  const {mutate:deleteComment} = useConvexMutation(api.comments.deleteComment);
  const {mutate:incrementViews}= useConvexMutation(api.public.incrementViewCount);

  const hasIncremented = React.useRef(false);

useEffect(() => {
  if(post && !isPostsLoading && !hasIncremented.current){
    incrementViews({ postId });
    hasIncremented.current = true;
  }
}, [isPostsLoading, post, incrementViews, postId]);

const {
      register, 
      handleSubmit,
      reset,
      control, 

    
      } = useForm<IComment>({ defaultValues: { comment: "" } });

      
      const commentContent = useWatch({
        control,
 
  name: "comment",
});

  const handleToogleLike = async() => {
    if(!myAuthAcc)
    {
      toast.error("Please sign in first")
      return
    }
    try {
      await toggleLike({ postId });
    
    } catch{
      
      toast.error("Failed to update like status");
    }

  

  }

  
  const handleAddComment = async(data:IComment) => {
    if(!myAuthAcc)
    {
      toast.error("Please sign in first")
      return
    }
    if (!data.comment?.trim()) {
    toast.error("Comment cannot be empty");
    return;
  }
    try {
      await addComment({ postId, content: data.comment});
      toast.success("Comment added successfully");
      reset()
    
    } catch{
      
      toast.error("Failed to add comment");
    }
  }

  const handleDeleteComment = async() => {
    if(!myAuthAcc)
    {
      toast.error("Please sign in first")
      return
    }

    if(!deletedComment) return;
    
    try {

      await deleteComment({ commentId: deletedComment });
      toast.success("Comment deleted successfully");
    } catch{
      
      toast.error("Failed to delete comment");
    }
  }



  if (isPostsLoading) 
    return(
   <div className="min-h-screen text-gray-700 dark:text-white dark:bg-linear-to-br from-emerald-950/50 via-emerald-900/50 to-black/10">
        <PublicHeader link="/feed" title="Back "/>
        <BarLoader  width={"100%"} color="#007A55" />

    </div>)

  if(isPostErr||!post)
{
  notFound()
}

 


  return (
    <>
    
    <div className="min-h-screen text-gray-700 dark:text-white dark:bg-linear-to-br from-emerald-950/50 via-emerald-900/50 to-black/10">
        <PublicHeader link="/feed" title="Back "/>

        <div className="max-w-5xl mx-auto px-5 py-10">
          <div className=" max-w-5xl mx-auto space-y-8">
             {
                post.featuredImage && (
            <div className="  mx-auto border  h-96 rounded-xl overflow-hidden">
             
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    priority
                    width={600}
                    height={400}
                    className="w-full h-full mx-auto rounded-xl object-contain"
                  />
               
            </div>
             )
              }
            <div className="space-y-5">
            <h1 className=" text-3xl md:text-5xl font-bold linE- bg-linear-to-br from-emerald-950 dark:from-emerald-200 via-emerald-900 dark:via-emerald-100 to-black/50 dark:to-emerald-100/50  text-transparent bg-clip-text">
              {post.title}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full">

                  
                  {
                    post.author.imageUrl?
                    (
                      <Image
                    src={post.author.imageUrl}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    className="w-full h-full rounded-full"
                  />
                    ):(
                       <div className="w-full h-full flex items-center justify-center rounded-full bg-linear-to-br from-emerald-800/5 to-emerald-900/50 text-white text-2xl font-bold">
                        {post.author.name?.charAt(0).toUpperCase() || ""}
                    </div>
                    )
                  }
                  </div>
                  <div>
                    <p className="text-lg font-medium">{post.author.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">@{post.author.username}</p>
                  </div>
                  
                </div>
              </div>
              <div className="space-y-2">
                    <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Eye className="w-4 h-4" />
                      {post.viewCount.toLocaleString()} Views
                    </span>
                  </div>
            </div>

            {
                                post.tags&&post.tags.length>0&&(
                                    <div className="flex flex-wrap gap-2">
                                        {
                                            post.tags.map((tag)=>(
                                                <Badge key={tag} variant="secondary"
                                                className="bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/30 text-xs">
                                                    {tag}
                                                </Badge>
                                            )
                                            )
                                        }
                                        
                                    </div>    
                                )
                            }

            <div
            className="prose prose-lg max-w-none prose-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
            /> 
            <div className="border-t border-slate-300 dark:border-slate-600 py-4 flex gap-6 mt-15">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleToogleLike}>
                  {hasUserLiked ? (
                    <Heart className="w-7 h-7 text-red-500 fill-current" />
                  ) : (
                    <Heart className="w-7 h-7" />
                  )}
                  
                </Button>
                <span className="text-sm font-medium">{post.likeCount}</span>

              </div>

                <Link href="#comments" className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" >
                  <MessageCircle className="w-7 h-7" />
                  </Button>
                <span className="text-sm font-medium">{comments?.length}</span>
                </Link>
               
               
              

            </div>

            <div id="comments" className="space-y-5 mt-5">
              <h3 className="font-semibold text-2xl">Comments</h3>
              {
                myAuthAcc?
                (
                  <Card className="bg-white dark:bg-emerald-950 border-gray-100  dark:border-emerald-900/50   w-full ">
                  <CardContent className="p-5">
                    <form onSubmit={handleSubmit(handleAddComment)}  className="space-y-6">
                      <Textarea
                      {...register("comment", {
                          required: true,
                          minLength: 1,
                          maxLength: 1000,
                        })}
                      placeholder="Write a comment..."
                      className=" w-full pl-5 focus:outline-none! focus:ring-0! focus:border-gray-400! dark:focus:border-emerald-700!"
                      rows={3}
                      maxLength={1000}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {commentContent.length}/1000 characters

                        </span>

                        <Button disabled={isAddingComment} variant={"primary"} type="submit"
                        className="flex items-center gap-2"
                        >
                          {
                            isAddingComment?
                            (
                              <>
                              Adding...
                              <Loader className="w-4 h-4 animate-spin" />
                            </>
                            ):(
                              <>
                              
                              <Send className="w-4 h-4" />
                              Add Comment
                              </>
                        
                            )
                          }
                          
                         

                        </Button>

                      </div>
                    </form>  
                  </CardContent>
              </Card>        
                ):
                (
                  <Card className="bg-white dark:bg-emerald-950 border-gray-100  dark:border-emerald-900/50   w-full ">
                  <CardContent className="p-10 flex flex-col items-center justify-center gap-5 ">
                    <div className=" text-slate-500 dark:text-slate-300 ">
                      Please sign in to share your opinions with us.
                    </div>
                    <Link href="/sign-in" className="">
                      <Button variant={"primary"} size={"lg"}>
                        Sign in Now!
                      </Button>  
                    </Link>
                  </CardContent>
                  </Card>
                )
              }  

              {
                isCommentsLoading?
                (
                  <div className="my-10">
                    <BarLoader  width={"100%"} color="#007A55" />
                  </div> 
                ):comments &&comments.length>0?
                (
                  <div className="space-y-5">

                  {comments.map((comment) => (
                    <Card  key={comment._id} className="bg-white dark:bg-emerald-950 border-gray-100  dark:border-emerald-900/50   w-full ">
                      <CardContent className="p-5 space-y-5">
                      <div className="flex items-center justify-between">
                          <div className="flex gap-3">

                           <div className="w-8 h-8 rounded-full">

                        

                          {
                    comment.author?.imageUrl?
                    (
                      <Image
                    src={comment.author.imageUrl}
                    alt={comment.author.name}
                    width={24}
                    height={24}
                    className="w-full h-full rounded-full"
                  />
                    ):(
                       <div className="w-full h-full flex items-center justify-center rounded-full bg-linear-to-br from-emerald-800/5 to-emerald-900/50 text-white text-2xl font-bold">
                        {comment?.author?.name?.charAt(0).toUpperCase() || ""}
                    </div>
                    )
                  }
                        </div>
                        <div>
                    <p className=" font-medium">{comment.author?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400"> 
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}


                    </p>
                  </div>
                        
                          
                        </div>
                        <div>
                        { myDbAcc&&comment.author&&
                        (myDbAcc._id===comment.author._id||myDbAcc._id===post.authorId)&&
                        (<Button variant={"ghost"}
                          onClick={()=>{
                            setDeletedComment(comment._id)
                            setIsDeletedModalOpen(true)
                          }}
                          className="text-slate-500 dark:text-slate-400 hover:text-red-400 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />

                        </Button>

                        )
                        
                        }
                        </div>
                      </div>
                        <p className="whitespace-pre-wrap">
                          {comment.content}
                        </p>
 
                      </CardContent>
                    </Card>
                  ))
                  }
                </div>

                ):
                (
                  <Card className="bg-white dark:bg-emerald-950 border-gray-100  dark:border-emerald-900/50   w-full ">
                    <CardContent className="p-10  text-slate-500 dark:text-slate-400 flex  flex-col justify-center items-center space-y-3">
                      <MessageCircle className="w-10 h-10 " />
                      <p className="text-lg font-medium">No comments yet.</p>
                      <p className="text-sm ">Be the first share your thoughts! </p>


                    </CardContent>
                  </Card>  
                )
              }
            </div>


      


            </div>
          </div>
        </div>
         <style jsx global>{`

.prose-content {
  font-size: 1.125rem;
  line-height: 1.7;
  color: rgb(55, 65, 81);
}

.prose-content :where(p, span, li, strong, em):not([style*="color"]) {
  color: inherit;
}

.prose-content h1,
.prose-content h2,
.prose-content h3 {
  font-weight: 600;
  color: rgb(17, 24, 39);
}

.prose-content h1 {
  font-size: 2.5rem;
  margin: 1rem 0;
}

.prose-content h2 {
  font-size: 2rem;
  margin: 0.75rem 0;
}

.prose-content h3 {
  font-size: 1.5rem;
  margin: 0.5rem 0;
}

.prose-content p {
  margin: 1rem 0;
}

.prose-content blockquote {
  border-left: 4px solid #1f3b24;
  background: #1f3b242a;
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  font-style: italic;
  border-radius: 0.25rem;
}

.prose-content blockquote p {
  margin: 0;
}

.prose-content a {
  text-decoration: underline;
}

.prose-content code {
  background: rgb(226, 232, 240);
  color: rgb(185, 28, 28);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: monospace;
}

.prose-content pre {
  background: #282A35;
  color: rgb(226, 232, 240);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose-content pre code {
  background: transparent;
  color: inherit;
  padding: 0;
}

.prose-content ul,
.prose-content ol {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.prose-content img {
  max-width: 700px;
  border-radius: 0.75rem;
  margin: 1rem 0;
}

/* ========== DARK MODE ========== */
.dark .prose-content {
  color: rgb(203, 213, 225);
}

.dark .prose-content h1,
.dark .prose-content h2,
.dark .prose-content h3 {
  color: white;
}

.dark .prose-content code {
  background: rgb(51, 65, 85);
  color: rgb(248, 113, 113);
}
`}</style>



    </div>
     <Dialog open={isDeletedModalOpen} onOpenChange={() => setIsDeletedModalOpen(false)}>
      <DialogContent className="space-y-2 flex flex-col items-center justify-center p-10">

        <p className="font-semibold">Are you sure you want to delete this Comment?</p>
        <div className="flex items-center gap-7">
            <Button variant={"destructive"}
        onClick={() => { handleDeleteComment(); setIsDeletedModalOpen(false); }}>
        Delete

        </Button>
        <Button variant={"default"} onClick={() => setIsDeletedModalOpen(false)}>
        Cancel
        </Button>
    
        </div>
    </DialogContent>

      </Dialog>

    </>
  )
}

export default PostPage