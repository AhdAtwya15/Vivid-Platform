"use client"
import { IPost } from "@/interfaces"
import { Button } from "../ui/button"
import { ArrowLeft, Calendar, Edit, Loader, Save, Send, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { useState } from "react"
import { Badge } from "../ui/badge"


interface IProps
{
    initialData?: IPost
    mode: "create" | "edit"
    onBack: () => void
    onSave: () => void
    onPublish: () => void
    onSchedule: () => void
    onSettings: () => void
    isPublishing: boolean
    isSavingDraft?: boolean
    isAutoSaving?: boolean
}

const PostEditorHeader = ({
    initialData,
    mode,
    onBack,
    onSave,
    onPublish,
    onSchedule,
    onSettings,
    isPublishing,
    isSavingDraft = false,
    isAutoSaving = false
}:IProps) => {
    const [isPublishMenuOpen, setIsPublishMenuOpen] = useState<boolean>(false)
    const isDraft = initialData?.status === "draft"
    const isEdit= mode==="edit"

  return (
    <header className="sticky top-0 z-10 bg-gray-50 dark:bg-[#002C22]  backdrop-blur-sm border-b border-gray-300 dark:border-gray-800">
        <div className="flex justify-between items-center max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center gap-5">
                <Button variant={"ghost"}
                onClick={onBack}
                className="flex items-center gap-2"
                disabled={isPublishing || isSavingDraft}
                >
                    <ArrowLeft className="h-4 w-4" />
                   Back
                </Button>   
                {
                    isDraft&&
                    <Badge variant={"secondary"} className=" bg-orange-500/20 text-orange-600 dark:text-orange-300 border-orange-500/30 ml-auto">
                        Draft
                    </Badge>
                }
                
            </div>
            <div className="flex items-center gap-3">
                <Button variant={"ghost"}
                onClick={onSettings}
                disabled={isPublishing || isSavingDraft}
                >
                    <Settings className="h-4 w-4" />
                   
                </Button>   
                {
                    !isEdit && (
                        <Button variant={"ghost"}
                        onClick={onSave}
                        disabled={isPublishing || isSavingDraft || isAutoSaving}
                        >
                            {isSavingDraft ? (
                                <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                        </Button>   
                    )
                }
                {
                    isEdit ? (
                        <Button variant={"primary"}
                        onClick={onPublish}
                        disabled={isPublishing || isSavingDraft || isAutoSaving}
                        className="flex items-center gap-2"
                        > <Edit className="w-4 h-4 "/>
                                Update
                            
                            
                            
                        </Button>   
                    )
                    :(
                        <DropdownMenu open={isPublishMenuOpen} onOpenChange={setIsPublishMenuOpen} >
                            <DropdownMenuTrigger asChild>
                                <Button
                                variant={"primary"}
                                className="flex items-center gap-2"
                                disabled={isPublishing || isSavingDraft || isAutoSaving}
                                >
                                    {isPublishing ? 
                                    <>
                                    <Loader className="w-4 h-4 animate-spin"/>
                                    Publishing...
                                    </>
                            
                            : 
                            <>
                            <Send className="h-4 w-4" />
                             Publish
                            </>
                            }
                           

                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-46 p-2 text-sm  " >
                              
                
                                <DropdownMenuItem
                                onClick={() => 
                                {
                                    onPublish()     
                                    setIsPublishMenuOpen(false)
                                } 
                                }
                                className="flex items-center gap-3 hover:bg-black/10  dark:hover:bg-white/10 p-2 rounded-lg cursor-pointer"

                                >
                                    <Send className="h-4 w-4" />
                                    Publish Now
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                onClick={() => 
                                {
                                    onSchedule()     
                                    setIsPublishMenuOpen(false)
                                } 
                                }
                                className="flex items-center gap-3 hover:bg-black/10  dark:hover:bg-white/10 p-2 rounded-lg cursor-pointer"

                                >
                                    <Calendar className="h-4 w-4" />
                                    Schedule for later
                                </DropdownMenuItem>
                               
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                }


               
            </div>

        </div>

    </header>
  )
}

export default PostEditorHeader

