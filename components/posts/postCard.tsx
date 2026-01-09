"use client"
import { BadgeVariant, IPost } from "@/interfaces"
import { Card, CardContent } from "../ui/card";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import {  useState } from "react";
import { Badge } from "../ui/badge";
import { Calendar, Edit, ExternalLink, Eye, Heart, MessageCircle, MoreHorizontal, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { DropdownMenuContent } from "../ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/useConvexQueryHook";
import { Dialog, DialogContent } from "../ui/dialog";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface IProps
{
    post:IPost;
    showAuthor?:boolean;
    showOptions?:boolean;
    onEdit?: (post:IPost) => void;
    className?:string
}

const now = Date.now()
const PostCard = ({post, showAuthor=false, showOptions=false, onEdit, className=""}:IProps) => {
    const [deletedPost, setDeletedPost] = useState<Id<"posts">|null>(null)
    const [isDeletedModalOpen, setIsDeletedModalOpen] = useState<boolean>(false);
    const deletePost = useConvexMutation(api.posts.deletePost)

    const onDelete= async() => {
         if (!deletedPost) return;

        try {
      await deletePost.mutate({ id: deletedPost });
      toast.success("Post deleted successfully");
    } catch  {
      toast.error("Failed to delete post");
    }
    }





    const getStatusBadge = (post:IPost):{ variant: BadgeVariant, className: string, label: string } => {
        if(post.status==="published")
        {
            if(post.scheduledFor&&post.scheduledFor> now)
            {
                return {
                    variant: "secondary",
                    className: "text-xs bg-blue-500/20 text-blue-400 dark:text-blue-300 border-blue-500/30",
                    label: "Scheduled"
                }
            }
            return {
                    variant: "default",
                    className: "text-xs bg-green-500/20 text-green-400 dark:text-green-300 border-green-500/30",
                    label: "Published"
                }

        }
        return {
                    variant: "outline",
                    className: "txst-sm bg-orange-500/20 text-orange-400 dark:text-orange-300 border-orange-500/30",
                    label: "Draft"
                }
    }

    const getPostUrl=()=>{
        if(post.status==="published"&&(post.author?.username||post?.username))
            return `/${post.author?.username||post.username}/${post._id}`

        return null
    }

    const badge=getStatusBadge(post)
    const postUrl=getPostUrl()
  return (
    <>
    
    <Card className={`card-glass transition-all duration-300 ${className} `}>
        <CardContent>
            <div className="space-y-4">
                <Link href={postUrl||"#"}
                className={!postUrl?"cursor-events-none":"cursor-pointer"}
                target="_blank"
                >
                    <div className="relative w-full rounded-lg h-45 overflow-hidden">
                        <Image
                        src={post.featuredImage || "https://ik.imagekit.io/7xylxjvvl/vivid/placeholder.png"}
                        alt={post.title}
                        fill
                        sizes="100vw"
                        className="object-cover w-full h-full"
                        />

                    </div>
                </Link>
                <div className="flex justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <Badge variant={badge.variant} className={badge.className}>
                            {badge.label}
                        </Badge>
                        {
                            post.scheduledFor && post.scheduledFor>now&&(
                                    <div className="flex items-center gap-1 text-xs text-blue-500 dark:text-blue-400">
                                        <Calendar className="w-3 h-3"/>
                                        {new Date(post.scheduledFor).toLocaleDateString()}
                                    </div>
                            )
                        }
                    </div>
                    {
                        showOptions&&(
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                   
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="w-4 h-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className=" p-2 text-sm   ">
                                    {
                                        onEdit && (
                                            <DropdownMenuItem
                                            className="flex items-center gap-2 hover:bg-black/10  dark:hover:bg-white/10 p-2 rounded-lg cursor-pointer transition-all duration-300"
                                            onClick={() => onEdit(post)}
                                            >
                                                <Edit className="w-4 h-4"/>
                                                Edit Post

                                            </DropdownMenuItem>
                                        )

                                    }
                                    {
                                        postUrl &&(
                                            <DropdownMenuItem asChild>
                                                <Link href={postUrl||"#"} target="_blank" className="flex items-center gap-2 hover:bg-black/10  dark:hover:bg-white/10 p-2 rounded-lg cursor-pointer transition-all">
                                                    <ExternalLink className="w-4 h-4"/>
                                                    View Public
                                                </Link>
                                            </DropdownMenuItem>
                                        )
                                    }
                                    <DropdownMenuItem
                                    className="flex items-center gap-2 hover:bg-black/10  dark:hover:bg-white/10 p-2 rounded-lg cursor-pointer transition-all"
                                    onClick={() =>
                                        { 
                                        setDeletedPost(post._id)
                                        setIsDeletedModalOpen(true)
                                    }}
                                    >
                                        <Trash className="w-4 h-4"/>
                                        Delete Post
                                    </DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    }

    
                    

                </div>
                <div>
                    <Link href={postUrl || "#"}>
                        <h3 className="text-lg font-semibold leading-none line-clamp-2 hover:text-emerald-700 transition-all duration-300">
                            {post.title}
                        </h3>
                    </Link>
                </div>
                {
                    showAuthor&&post.author&&(
                        <div className="flex items-center gap-3">
                           <Link href={`/${post.author.username}`}>
                            <div className="relative w-8 h-8">
                                {
                                    post.author.imageUrl ? (
                                        <Image
                                        src={post.author.imageUrl}
                                        alt={post.author.name || ""}
                                        fill
                                        sizes="32px"
                                        className="object-cover w-full h-full rounded-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center rounded-full bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-500">
                                            {post.author.name?.charAt(0).toUpperCase() || ""}
                                        </div>
                                    )
                                }
                            </div>    

                           </Link>
                            <div>
                                <p className="text-sm font-medium">
                                    {post.author.name}
                                </p>
                                {post.author.username&&(
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        @{post.author.username}

                                    </p>
                                )

                                }
                            </div>    
                        </div>    
                    )
                }
                {
                    post.tags&&post.tags.length>0&&(
                        <div className="flex flex-wrap gap-2">
                            {
                                post.tags.slice(0,3).map((tag)=>(
                                    <Badge key={tag} variant="secondary"
                                    className="bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/30 text-xs">
                                        {tag}
                                    </Badge>
                                )
                                )
                            }
                            {
                                post.tags.length>3&&(
                                    <Badge variant="secondary"
                                    className="bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/30 text-xs">
                                        +{post.tags.length-3} more
                                    </Badge>
                                )
                            }
                        </div>    
                    )
                }
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4"/>
                            {post.viewCount?.toLocaleString()||0}
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4"/>
                            {post.likeCount?.toLocaleString()||0}
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4"/>
                            0
                        </div>
                    </div>
                    <time>
                        {
                            post.status==="published"&&post.publishedAt?(
                                formatDistanceToNow(new Date(post.publishedAt),
                            {
                                addSuffix: true,
                            })
                            ):(
                                formatDistanceToNow(new Date(post.createdAt),
                            {
                                addSuffix: true,
                            })

                            )
                        }

                    </time>

                </div>


            </div>
        </CardContent>
    </Card>    
     <Dialog open={isDeletedModalOpen} onOpenChange={() => setIsDeletedModalOpen(false)}>
      <DialogContent className="space-y-2 flex flex-col items-center justify-center p-10">

        <p className="font-semibold">Are you sure you want to delete this post?</p>
        <div className="flex items-center gap-7">
            <Button variant={"destructive"}
        onClick={onDelete}>
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

export default PostCard