import { z } from "zod";

export const usernameSchema=z.object({
    username: z.string().nonempty("Username cannot be empty").min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters")
    .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens"
    ),
    })
 

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(), 
  category: z.string().optional(),
 tags:z.array(z.string()).max(10,"Maximum 10 tags allowed").optional(),
  featuredImage: z.string().optional(),
  scheduledFor: z.string().optional(),
});


export const transformationSchema = z.object({

  aspectRatio: z.string().default("original"),
  customWidth: z.number().min(100).max(2000).optional(),
  customHeight: z.number().min(100).max(2000).optional(),

  cropMode: z.enum(["extract", "pad", "fill", "crop"]).optional(),
  smartCropFocus: z
    .enum(["auto", "face", "center", "top", "bottom"])
    .default("auto"),

  background: z.string().optional(),

  
  textOverlay: z.string().optional(),
  textFontSize: z.number().min(12).max(200).default(50),
  textColor: z.string().default("#ffffff"),
  textPosition: z
    .enum([
      "center",
      "top",
      "bottom",
      "right",
      "left",
      "top_left",
      "top_right",
      "bottom_left",
      "bottom_right",
    ])
    .default("center"),
  textPadding: z.number().min(0).max(100).optional(),
  textBackground: z.string().optional(),

  grayscale: z.boolean().default(false),
  
  
  blur: z.number().min(0).max(100).optional(),
  opacity: z.number().min(0).max(100).optional(),
  rotate: z.number().min(0).max(360).optional(),

  radius: z.union([z.number(), z.literal("max")]).optional(),
  trim: z.number().min(0).max(100).optional(),

  borderWidth: z.number().min(0).max(50).optional(),
  borderColor: z.string().optional(),
});



export type PostFormValues = z.infer<typeof postSchema>;
export type TransformationFormValues =z.input<typeof transformationSchema>;
