"use client"
import { PostFormValues } from "@/schemas";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { toast } from "sonner";




interface IProps
{
    form: UseFormReturn<PostFormValues>;
    isOpen:boolean;
    onClose:() => void;
    mode:"create" | "edit";

}





const PostEditorSettings = ({form,isOpen,onClose,mode}:IProps) => {
    const [tagsInput,setTagsInput]=useState<string>("");
    const {setValue,watch}=form
    const watchedValues=watch()

    const CATEGORIES = [
  "Technology",
  "Design",
  "Marketing",
  "Business",
  "Lifestyle",
  "Education",
  "Health",
  "Travel",
  "Food",
  "Entertainment",
];

const handleTags=(e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key==="Enter"||e.key===","){
        e.preventDefault()
        addTag()
    }

}
const addTag = () => {
    const tag=tagsInput.trim().toLowerCase();
    
   
    if((watchedValues.tags?.length || 0) >= 10) {
        toast.error("Maximum 10 tags allowed");
        return;
    }
    
    if(tag&&!watchedValues.tags?.includes(tag)) {
        setValue("tags", [...(watchedValues.tags || []) ,tag]);     
    }
    setTagsInput("");
};



const removeTag = (tag: string) => {
  setValue(
    "tags",
    watchedValues.tags?.filter((t) => t !== tag)
  );
};



  return (

    <Dialog open={isOpen} onOpenChange={onClose}>
     

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold">Post Settings</DialogTitle>
            <DialogDescription>
              Configure your post details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-7">
            <div className="grid gap-3">
                <Label className="font-semibold">Category</Label>
                <Select
                onValueChange={(value)=>setValue("category",value)}
                value={watchedValues.category}>
                    <SelectTrigger className="">
                        <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            CATEGORIES.map((category)=><SelectItem key={category} value={category}>{category}</SelectItem>)
                        }
                        

        
                    </SelectContent>
                </Select>
             
            </div>
            <div className="grid gap-3">
                <Label className="font-semibold">Tags</Label>
                <div className="flex gap-2">
                    <Input 
                onChange={(e) => setTagsInput(e.target.value)}
                value={tagsInput}
                placeholder="Add tags..."
                onKeyDown={handleTags}
                disabled={(watchedValues.tags?.length || 0) >= 10}
                />
                <Button
                variant={"outline"}
                onClick={addTag}
                disabled={(watchedValues.tags?.length || 0) >= 10}>
                    <Plus className="w-4 h-4"/>
        

                </Button>

                </div>
               {
                watchedValues.tags && watchedValues.tags.length > 0&&
             
                 <div className="flex flex-wrap gap-2">
                   {
                    watchedValues?.tags.map((tag) => (
                      <Badge variant={"outline"}  key={tag} className="flex items-center bg-emerald-500/20 dark:bg-emerald-800/30 gap-1 px-2 py-1 rounded-full text-xs font-medium  group ">
                        {tag}
                        <button onClick={() => removeTag(tag)}>
                          <X className="w-3 h-3 transition-all duration-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-500"  />

                        </button>
                       
                      </Badge >
                    ))
                    }



                   
                    
                </div>
                
                

                }
                 <p className={`text-xs font-semibold ${ (watchedValues.tags?.length || 0) >= 10 ? 'text-green-900 dark:text-green-600' : 'text-slate-500' }`}>
  {(watchedValues.tags?.length || 0)} / 10 tags {(watchedValues.tags?.length || 0) >= 10 ? ". Maximum 10 tags allowed" : ". Press enter or comma to add"}
</p>

               
               
               </div>
               {
                mode==="create"&&
                <div className="grid gap-3">
                <Label className="font-semibold">Schedule Publication</Label>
                <Input
                type="datetime-local"
                onChange={(e) => setValue("scheduledFor", e.target.value)}
                value={watchedValues.scheduledFor}
                min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs font-semibold text-slate-500">
                  Leave empty to publish immediately
                </p>
                
             
            </div>
               }
           
      
          </div>
        </DialogContent>

    </Dialog>

  )
}

export default PostEditorSettings

