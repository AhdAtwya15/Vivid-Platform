"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ViewsChart from "@/components/ui/viewsChart"
import { api } from "@/convex/_generated/api"
import useConvexQuery from "@/hooks/useConvexQueryHook"
import { IDashboardAnalytics } from "@/interfaces"
import { formatDistanceToNow } from "date-fns"
import { BarChart3, Calendar, Circle, CirclePlus, Eye, Heart, MessageCircle, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { BarLoader } from "react-spinners"


const now = Date.now()

const Dashboard = () => {

  const {data:analytics,isLoading:isAnalyticsLoading}=useConvexQuery(api.dashboard.getAnalytics)
  console.log("analytics",analytics)

  const {data:recentPosts,isLoading:isPostsLoading}=useConvexQuery(api.dashboard.getPostsWithAnalytics,{limit:5})
  console.log("recentPosts",recentPosts)

  const {data:recentActivity,isLoading:isRecentActivityLoading}=useConvexQuery(api.dashboard.getRecentActivity,{limit:8})
  console.log("recentActivity",recentActivity)

  const {data:dailyViews,isLoading:isDailyViewsLoading}=useConvexQuery(api.dashboard.getDailyViews)
  console.log("dailyViews",dailyViews)

  const formatData= (time:number)=>{
    return formatDistanceToNow(new Date(time),{addSuffix:true})
  }

  if(isAnalyticsLoading) return  <BarLoader width={"100%"} color="#007A55"/>

  const states:IDashboardAnalytics = analytics|| {
    totalViews:0,
    totalLikes:0,
    totalComments:0,
    totalFollowers:0,
    viewsGrowth:0,
    likesGrowth:0,
    commentsGrowth:0,
    followersGrowth:0,
  }




  return (
    <div className="space-y-6 p-4 lg:p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center  gap-5">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold">My Dashborad</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View and manage your dashboard.</p>
        </div>
        <Link href={"/dashboard/create"}>
          <Button variant={"primary"} className="flex items-center gap-2">
            <CirclePlus className="w-4 h-4" />
            Create New Post
          </Button>
        </Link>
        
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="card-glass">
          <CardHeader className="flex justify-between items-center px-4">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-300">
              Total Views
            </CardTitle>
            <Eye className="w-4 h-4 text-green-600 " />

          </CardHeader>
          <CardContent className="px-4 space-y-3">
            <div className="text-2xl font-bold ">
              {states.totalViews.toLocaleString()}
            </div>
            {
              states.viewsGrowth>0&&(
                <div className="text-xs flex items-center gap-1 font-medium text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  +{states.viewsGrowth.toLocaleString()}%
                  from last month
                </div>
              )
            }
          </CardContent>
        </Card>
         <Card className="card-glass">
          <CardHeader className="flex justify-between items-center px-4">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-300">
              Total Likes
            </CardTitle>
            <Heart className="w-4 h-4 text-red-600 " />

          </CardHeader>
          <CardContent className="px-4 space-y-3">
            <div className="text-2xl font-bold ">
              {states.totalLikes.toLocaleString()}
            </div>
            {
              states.likesGrowth>0&&(
                <div className="text-xs flex items-center gap-1 font-medium text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  +{states.likesGrowth.toLocaleString()}%
                  from last month
                </div>
              )
            }
          </CardContent>
        </Card>
         <Card className="card-glass">
          <CardHeader className="flex justify-between items-center px-4">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-300">
              Comments
            </CardTitle>
            <MessageCircle className="w-4 h-4 text-blue-600 " />

          </CardHeader>
          <CardContent className="px-4 space-y-3">
            <div className="text-2xl font-bold ">
              {states.totalComments.toLocaleString()}
            </div>
            {
              states.commentsGrowth>0&&(
                <div className="text-xs flex items-center gap-1 font-medium text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  +{states.commentsGrowth.toLocaleString()}%
                  from last month
                </div>
              )
            }
          </CardContent>
        </Card>
         <Card className="card-glass">
          <CardHeader className="flex justify-between items-center px-4">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-300">
              Followers
            </CardTitle>
            <Users className="w-4 h-4 text-amber-400 " />

          </CardHeader>
          <CardContent className="px-4 space-y-3">
            <div className="text-2xl font-bold ">
              {states.totalFollowers.toLocaleString()}
            </div>
            {
              states.followersGrowth>0&&(
                <div className="text-xs flex items-center gap-1 font-medium text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  +{states.followersGrowth.toLocaleString()}%
                  from last month
                </div>
              )
            }
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        <div className="lg:col-span-2 space-y-5 ">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <h2 className="text-lg font-medium" >
                  Recent Posts
                </h2>
                <Link href={"/dashboard/posts"}>
                <Button variant={"ghost"}>
                  View All
                </Button>
                </Link>

              </CardTitle>
            </CardHeader>
            <CardContent>
              {
                isPostsLoading?(
                  <div className="w-full h-full flex justify-center items-center">
                    <BarLoader width={"100%"} color="#007A55"/>
                  </div>
                ):!recentPosts||recentPosts.length===0?(
                  <div className=" flex flex-col justify-center items-center space-y-4  pb-5">
                    <p className=" text-slate-500 dark:text-slate-400">
                      No Posts yet
                    </p>
                    <Link href={"/dashboard/create"}>
                      <Button variant={"primary"}
                      className="flex items-center gap-2">
                        <CirclePlus className="w-4 h-4" />
                        Create your first Post
                      </Button>
                    </Link>
                  </div>
                ):(
                  <div className="space-y-3">
  {recentPosts.map((post) => {
    const isScheduled =
      post.status === "published" &&
      !!post.scheduledFor &&
      post.scheduledFor > now;

    return (
      <Link
      href={`/dashboard/posts/edit/${post._id}`}
      key={post._id}
      className="py-4 px-5 flex justify-between items-center bg-gray-100 hover:bg-gray-200  dark:bg-emerald-900/40 dark:hover:bg-emerald-900/20 rounded-xl transition-all duration-300"
      >
        <div className="flex flex-col gap-2">
          <h3 className="font-medium">{post.title}</h3>

          <div className="flex items-center gap-3">
            <Badge
              variant={
                isScheduled
                  ? "secondary"
                  : post.status === "published"
                  ? "default"
                  : "outline"
              }
              className={
                isScheduled
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : post.status === "published"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-orange-500/20 text-orange-400 border-orange-500/30"
              }
            >
              {isScheduled ? "scheduled" : post.status}
            </Badge>

            <span className=" text-sm text-slate-500 dark:text-slate-400">
              {isScheduled
                ? `Scheduled for ${new Date(
                    post.scheduledFor!
                  ).toLocaleString()}`
                : post.status === "published"
                ? `Published ${formatData(post.publishedAt || 0)}`
                : `Updated ${formatData(post.updatedAt || 0)}`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 " />
            <span className="text-sm ">
              {post.viewCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 " />
            <span className="text-sm ">
              {post.likeCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4 " />
            <span className="text-sm ">
              {post.commentCount.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
      
    );
  })}
</div>

                )
              }

            </CardContent>

          </Card>
          <Card className="card-glass">
            <CardHeader>
               <CardTitle >
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics Overview
                </h2>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400 font-normal">Views over the last 30 days</CardDescription>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ViewsChart data={dailyViews || []} isLoading={isDailyViewsLoading}/>

            </CardContent>

          </Card>

        </div>

        <div className="lg:col-span-1 space-y-5">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>
                <h2 className="text-lg font-medium" >
                  Recent Activity
                </h2>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400 font-normal">Latest interactions with your content</CardDescription>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {
                isRecentActivityLoading?(
                  <div className="w-full h-full flex justify-center items-center">
                    <BarLoader width={"100%"} color="#007A55"/>
                  </div>
                ):!recentActivity||recentActivity.length===0?(
                  <div className="flex flex-col justify-center items-center space-y-4  pb-5">
                    <p className=" text-slate-500 dark:text-slate-400">
                      No Recent Activity.
                    </p>
                  </div>
                ):
                (
                  <div className="space-y-4">
                    {

                      recentActivity.map((activity,index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex justify-center items-center ${
                            activity.type === "like" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                            activity.type === "comment" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                            activity.type === "follow" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                            "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }`}>
                            {
                              activity.type === "like" ? (
                                <Heart className="w-4 h-4 " />
                              ) : activity.type === "comment" ? (
                                <MessageCircle className="w-4 h-4 " />
                              ) : activity.type === "follow" ? (
                                <Users className="w-4 h-4 " />
                              ) : (
                                <Circle className="w-4 h-4 " />
                              )
                            }
                          </div> 
                          <div>
                            <p className="text-sm">{activity.user}
                              {
                                activity.type === "like" ? ` liked your post "${activity.post}"` :
                                activity.type === "comment" ? ` commented on your post "${activity.post}"` :
                                activity.type === "follow" ? " started following you" :
                                "interacted"
                              }
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {formatDistanceToNow(new Date(activity.time))}
                             
                            </p>
                          </div>
                          
                        </div>
                      ))
                    }


                  </div>
                )
              }
            </CardContent>
          </Card>
          <Card className="card-glass ">
            <CardHeader>
              <CardTitle>
                <h2 className="text-lg font-medium" >
                  Recent Activity
                </h2>

              </CardTitle>

              <CardContent className="space-y-5 pl-0 mt-3">
                <Link href={"/dashboard/create"}>
                  <Button size={"lg"} variant={"ghost"} className="w-full flex justify-start items-center gap-x-3">
                    <CirclePlus className="w-4 h-4" />
                    Create New Post 
                  </Button>
                </Link>
               
               
                <Link href={"/dashboard/posts"}>
                  <Button size={"lg"} variant={"ghost"} className="w-full flex justify-start items-center gap-x-3">
                    <Calendar className="w-4 h-4" />
                    Manage Posts
                  </Button>
                </Link>
                <Link href={"/dashboard/followers"}>
                  <Button size={"lg"} variant={"ghost"} className="w-full flex justify-start items-center gap-x-3">
                    <Users className="w-4 h-4" />
                    View Followers
                  </Button>
                </Link>

              </CardContent>
            </CardHeader>

          </Card>
        </div>

      </div> 
      

    </div>
  )
}

export default Dashboard