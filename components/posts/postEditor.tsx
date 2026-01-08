"use client"
import { PostFormValues, postSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PostEditorHeader from "./postEditorHeader";
import { ImageKitFile, IPost } from "@/interfaces";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PostEditorContent from "./postEditorContent";
import PostEditorSettings from "./postEditorSettings";


import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/useConvexQueryHook";
import { toast } from "sonner";
import ImageModal from "../ui/ImageModal";
import { Editor } from "@tiptap/react";


interface IProps
{
    initialData?:IPost
    mode: "create" | "edit" 

}

const PostEditor = ({initialData,mode="create"}:IProps) => {
    const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
    const [imageModalType, setImageModalType] = useState<"featured" | "content">("featured");
    const editorRef = useRef<Editor | null>(null);
    

    const [isAutoSaving, setIsAutoSaving] = useState<boolean>(false);
    const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
    const [isPublishingPost, setIsPublishingPost] = useState<boolean>(false);

    const{mutate:createPost}=useConvexMutation(api.posts.create)
    const{mutate:updatePost,isLoading:isUpdatingPost}=useConvexMutation(api.posts.update)

    const router=useRouter()


   const handleImageSelect = (imageData: ImageKitFile) => {
  if (imageModalType === "featured") {
    form.setValue("featuredImage", imageData.url);
    
  } else if (imageModalType === "content" && editorRef.current) {
    editorRef.current
      .chain()
      .focus()
      .setImage({ src: imageData.url })
      .run();

    toast.success("Image inserted!");
  }

  setIsImageModalOpen(false);
};



     const form = useForm<PostFormValues>({
            resolver: zodResolver(postSchema),
            defaultValues: {
                title: initialData?.title || "",
                content: initialData?.content || "",
                category: initialData?.category || "",
                tags: initialData?.tags || [],
                featuredImage: initialData?.featuredImage || "",
                scheduledFor: initialData?.scheduledFor ? new Date(initialData.scheduledFor).toISOString().slice(0, 16) : ""
            }
     });

     const {watch,handleSubmit,getValues}=form
     
 
     const watchedValues = {
         title: watch("title"),
         content: watch("content"),
         category: watch("category"),
         tags: watch("tags"),
         featuredImage: watch("featuredImage"),
         scheduledFor: watch("scheduledFor")
     };

  
     const lastSavedValues = useRef<{title: string, content?: string}>({
         title: initialData?.title || "",
         content: initialData?.content || ""
     });

    const onSubmit = useCallback(
  async (data: PostFormValues, action: "draft" | "published", operationType: "auto" | "manual" | "publish" | "schedule" = "manual") => {
    try {
      const postData = {
        title: data.title,
        content: data.content || "", 
        category: data.category || undefined,
        featuredImage:data.featuredImage,
        tags: data.tags,
        status: action, 
        scheduledFor: data.scheduledFor
          ? new Date(data.scheduledFor).getTime()
          : undefined,
      };

      let resultId;

      if (mode === "edit" && initialData?._id) {
        resultId = await updatePost({ id: initialData._id, ...postData });
       
      } else if (initialData?._id && action === "draft") {
        resultId = await updatePost({ id: initialData._id, ...postData });
      } else {
        resultId = await createPost(postData);
      }

      if (operationType === "manual") {
        toast.success("Draft saved successfully");
      } else if (operationType === "publish") {
        toast.success("Post published successfully");
        router.push("/dashboard/posts");
      } else if (operationType === "schedule") {
        toast.success("Post scheduled successfully");
      }

      return resultId;
    } catch (error) {
      if (operationType !== "auto") {
        let message = "Failed to save post";
        
        if (error instanceof Error) {
          if (error.message.includes("network") || error.message.includes("fetch")) {
            message = "Network error. Please check your connection";
          } else if (error.message.includes("unauthorized") || error.message.includes("permission")) {
            message = "You don't have permission to do this";
          } else if (error.message.includes("not found")) {
            message = "Post not found";
          } else if (error.message.includes("duplicate")) {
            message = "A post with this title already exists";
          }
        }
        
        toast.error(message);
      }
      throw error;
    }
  },
  [mode, initialData, updatePost, createPost, router]
);


    const handleBack=() => {
        router.push("/dashboard")
    }
    
    const handleAutoSave = useCallback(async () => {
        const currentValues = getValues();
        
        if (!currentValues.title?.trim()) {
            return;
        }
        
        if (currentValues.title === lastSavedValues.current.title && 
            currentValues.content === lastSavedValues.current.content) {
            return;
        }

        setIsAutoSaving(true);
        try {
            await onSubmit(currentValues, "draft", "auto");
            lastSavedValues.current = {
                title: currentValues.title,
                content: currentValues.content || ""
            };
        } catch (error) {
            console.error('Auto-save failed:', error);
        } finally {
            setIsAutoSaving(false);
        }
    }, [getValues, onSubmit]);

    const handleSave = useCallback(() => {
        handleSubmit(
            async (data) => {
                setIsSavingDraft(true);
                try {
                    await onSubmit(data, "draft", "manual");
                    lastSavedValues.current = {
                        title: data.title,
                        content: data.content || ""
                    };
                } catch  {
                    toast.error('Failed to save the draft. Please try again.');
                } finally {
                    setIsSavingDraft(false);
                }
            },
        )();
    }, [handleSubmit, onSubmit]);
    
    const handlePublish = useCallback(() => {
        handleSubmit(
            async (data) => {
                setIsPublishingPost(true);
                try {
                    await onSubmit(data, "published", "publish");
                } catch  {
                    toast.error('Failed to publish the post. Please try again');
                } finally {
                    setIsPublishingPost(false);
                }
            },
        )();
    }, [handleSubmit, onSubmit]);

    const handleSchedule = useCallback(() => {
        const currentValues = getValues();
        if(!currentValues.scheduledFor) {
            toast.error("Please select a date and time to schedule");
            return;
        }
        
        handleSubmit(
            async (data) => {
                setIsSavingDraft(true);
                try {
                    await onSubmit(data, "draft", "schedule");
                } catch {
                    toast.error('Failed to schedule the post. Please try again');
                } finally {
                    setIsSavingDraft(false);
                }
            },
            
        )();
    }, [handleSubmit, onSubmit, getValues]);

    useEffect(()=>{
    
        if(mode === "edit") return;
        if(!watchedValues.title) return;

        const autoSave = setInterval(() => {
            handleAutoSave();
        }, 30000); 
        return () => clearInterval(autoSave);
    }, [watchedValues.title, watchedValues.content, mode, handleAutoSave])

   
    
  return (
    <div className="min-h-screen ">
        <PostEditorHeader 
        initialData={initialData || undefined} 
        mode={mode} 
        onBack={handleBack} 
        onSave={handleSave} 
        onPublish={handlePublish} 
        onSchedule={handleSchedule} 
        onSettings={() => {setIsSettingOpen(true)}} 
        isPublishing={isPublishingPost||isUpdatingPost}
        isSavingDraft={isSavingDraft}
        isAutoSaving={isAutoSaving}
        />

        <PostEditorContent
        form={form}
        onImageUpload={(type) => {
            setImageModalType(type);
            setIsImageModalOpen(true);
        }}
        onEditorReady={(editor) => {
          editorRef.current = editor;
        }}
        />

        <PostEditorSettings
        form={form}
        isOpen={isSettingOpen}
        onClose={() => setIsSettingOpen(false)}
        mode={mode}
        />

        <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageSelect={handleImageSelect}
        title={imageModalType === "featured" ? "Select Featured Image" : "Select Content Image"}
        />
        

    </div>
  )
}

export default PostEditor
