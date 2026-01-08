import { Id } from "@/convex/_generated/dataModel";
import { LucideIcon } from "lucide-react";



export interface ISideBar
{
     title: string;
    href:string;
    icon:LucideIcon,
}

export interface IUpadteUsername{
  username:string
  
}


export interface IPost {
  _id: Id<"posts">;
  _creationTime?: number;
  title: string;
  content?: string;
  status: "draft" | "published";
  authorId: string;
  author?: {
    _id: string;
    name?: string;
    username?: string;
    imageUrl?: string;
  } | null;
  tags?: string[];
  category?: string;
  featuredImage?: string;
  scheduledFor?: number;
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
  viewCount: number;
  likeCount: number;
  username?: string;
}
export type ImprovementType = "enhance" | "expand" | "simplify";

export type IGenerateType = "generate" | "improve";

export type ImageType = {
  type: "featured" | "content";
}

export interface IAiBtn {
  type: ImprovementType;
  icon: LucideIcon;
  className: string;
}


export interface ITransformationFeatures
{
  label: string;
  value:string;
  width?: number;
  height?: number;

}

export interface ImageKitFile {
  fileId: string;    
  name: string;     
  url: string;      
  originalUrl?: string;       
  width: number;     
  height: number;    
  size?: number;      
}


export type ImageTransformation = 
  | { width?: number; height?: number; cropMode?: string; focus?: string; background?: string }
  | { effect: "grayscale" }
  | { effect: "contrast" }
  | { effect: "sharpen"; amount?: number }
  | { effect: "usm"; radius: number; sigma: number; amount: number; threshold: number }
  | { effect: "shadow"; blur?: number; saturation?: number; xOffset?: number; yOffset?: number }
  | { effect: "gradient"; direction?: number; fromColor?: string; toColor?: string; stopPoint?: number }
  | { effect: "color_replace"; toColor: string; tolerance?: number; fromColor?: string }
  | { blur: number }
  | { opacity: number }
  | { rotate: number | "auto" }
  | { flip: "h" | "v" | "h_v" }
  | { radius: number | "max" }
  | { trim: true | number }
  | { borderWidth: number | string; borderColor: string }
  | { overlayText: string; overlayTextFontSize?: number; overlayTextColor?: string; overlayTextPadding?: number; overlayBackground?: string; gravity?: "center" | "top" | "bottom" | "right" | "left" | "top_left" | "top_right" | "bottom_left" | "bottom_right" };


 export type BadgeVariant = "secondary" | "default" | "outline" | "destructive";

export interface IFollowUser {
  _id: Id<"users">;
  name: string;
  username?: string;
  imageUrl?: string | null;

  followedAt: number;

  postCount: number;
  lastPostAt?: number | null;

  
  followsBack?: boolean;

  followerCount?: number;
  recentPosts?: {
    _id: Id<"posts">;
    title: string;
    publishedAt?: number;
    viewCount: number;
    likeCount: number;
  }[];
}

export interface IDashboardAnalytics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalFollowers: number;

  viewsGrowth: number;
  likesGrowth: number;
  commentsGrowth: number;
  followersGrowth: number;
}

export interface IDailyView {
  date: string;      
  day: string;       
  fullDate: string;  
  views: number;     
}
