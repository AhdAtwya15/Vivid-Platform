"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api"
import useConvexQuery, { useConvexMutation } from "@/hooks/useConvexQueryHook";
import { AlertCircle, Loader, User } from "lucide-react";
import { BarLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/schemas";
import { IUpadteUsername } from "@/interfaces";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";




const SettingPage = () => {
    const { data:currentUser,isLoading } =
  useConvexQuery(api.users.getCurrentuser);
  const { mutate:updateUsername, isLoading:isSubmitting, error:isErrorUpdating } =
  useConvexMutation(api.users.updateUsername);
    

  const {
      register, 
      handleSubmit,
      formState: { errors },
      setValue
      } = useForm<IUpadteUsername>({
          resolver: zodResolver(usernameSchema),
          });

  useEffect(() => {
    if (currentUser) {
      setValue("username",currentUser.username||"");
    }
  }, [currentUser,setValue]);


  const onSubmit = async (data:IUpadteUsername) => {
    try{
      await updateUsername({
        username:data.username
      })
      toast.success("Username updated successfully!");

    }
    catch
    {
        toast.error(isErrorUpdating?.message || "Failed to update username");

    }
  }


    if(isLoading)
    {
        return <BarLoader  width={"100%"} color="#007A55" />
    }
  return (
    <div className="p-10 space-y-10">
        <div className="space-y-3">
          <h1 className="font-bold text-3xl bg-linear-to-r from-emerald-950 via-emerald-900 to-black/50 text-transparent bg-clip-text dark:text-white">
            Settingts
          </h1>
          <span className="text-gray-700 dark:text-gray-300">
            Manage your profile and account preferences
          </span>
        </div>
        <div>
           <Card  className="max-w-2xl bg-gray-100/10 dark:bg-emerald-950/20 border-gray-300  dark:border-emerald-900">
              <CardHeader>
          
                <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-white text-lg ">
                  <User className="w-5 h-5" />
                  Username Settings
                </CardTitle>
                <CardDescription className=" text-gray-700 dark:text-gray-300 -mt-1">
                  Set your unique username for your public profile
                </CardDescription>
              </CardHeader>
              <CardContent className="" >
                <form  onSubmit={handleSubmit(onSubmit)} className="space-y-6" >
                 <div className="space-y-2">
                   <Label htmlFor="username">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    {...register("username")}
                  />
                   {currentUser?.username && (
                <div className="text-sm text-gray-500 dark:text-slate-400">
                  Current username:{" "}
                  <span className="text-gray-700 dark:text-white">@{currentUser.username}</span>
                </div>
              )}
                   <div className="text-xs text-slate-500 dark:text-slate-300">
                3-20 characters, letters, numbers, underscores, and hyphens only
              </div>
              {errors.username && (
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.username.message}
                </p>
              )}

                 </div>
                
                 <Button 
                 variant={"primary"}
                 disabled={isSubmitting}>
                  {
                    isSubmitting ? 
                    (
                      <>
                      <Loader className="w-4 h-4 animate-spin"/>
                      Updating...
                      </>


                    ):(
                     "Update Username"
                    )
                  }
                 
                 </Button>
                </form>
              </CardContent>
            </Card>
        </div>

    </div>
  )
}

export default SettingPage