"use client"

import PostEditor from "@/components/posts/postEditor"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import useConvexQuery from "@/hooks/useConvexQueryHook"
import { useParams } from "next/navigation"
import { BarLoader } from "react-spinners"

const EditPostPage = () => {
  const params = useParams()

  const postId =
    typeof params.id === "string"
      ? (params.id as Id<"posts">)
      : null

  const { data: post, isLoading, error } = useConvexQuery(
    api.posts.getById,
    postId ? { id: postId } : "skip"
  )

  if (isLoading)
    return <BarLoader width="100%" color="#007A55" />

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Post Not Found
          </h1>
          <p className="text-slate-400">
            The post you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    )
  }

 
  return <PostEditor initialData={post} mode="edit" />
}

export default EditPostPage


