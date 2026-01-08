import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const validateEnvVars = () => {
  if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY) {
    console.error("Missing NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY environment variable");
    return false;
  }
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    console.error("Missing IMAGEKIT_PRIVATE_KEY environment variable");
    return false;
  }
  if (!process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
    console.error("Missing NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT environment variable");
    return false;
  }
  return true;
};

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string,
});

export const POST = async (req: Request) => {
  try{
      console.log("Environment variables check:");
      console.log("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY exists:", !!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
      console.log("IMAGEKIT_PRIVATE_KEY exists:", !!process.env.IMAGEKIT_PRIVATE_KEY);
      console.log("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT exists:", !!process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT);


      if (!validateEnvVars()) {
        return NextResponse.json(
          {
            success: false,
            error: "Server configuration error: Missing ImageKit environment variables",
          }, 
          {status:500}
        );
      }

      const {userId}=await auth()
      if(!userId) return NextResponse.json("Unauthorized", {status:401})
      
      const formData=await req.formData()
      const file=formData.get("file")
      const fileName=formData.get("fileName")
      
      if(!(file instanceof File))
          return NextResponse.json("File is required", {status:400})

      const bytes=await file.arrayBuffer()
      const buffer=Buffer.from(bytes)

      const timestamp=Date.now()
      const sanitizedFileName= typeof fileName === "string"
      ? fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
      : "upload";
      const uniqueFileName=`${userId}/${timestamp}_${sanitizedFileName}`;

      console.log("Uploading file to ImageKit with params:", { 
        fileName: uniqueFileName,
        size: buffer.length 
      });

      const uploadRes=await imagekit.upload({
          file: buffer,
          fileName: uniqueFileName,
          folder:"/vivid"
      });

      console.log("ImageKit upload successful:", { fileId: uploadRes.fileId, url: uploadRes.url });

      return NextResponse.json(
      {
          success: true,
          url: uploadRes.url,
          fileId: uploadRes.fileId,
          width: uploadRes.width,
          height: uploadRes.height,
          size: uploadRes.size,
          name: uploadRes.name,
      }
      )

  }catch(error)
  {
      console.error("ImageKit upload error:",error);
        const message =
    error instanceof Error ? error.message : "Unknown error occurred";
      return NextResponse.json(
          {
              success: false,
              error: "Failed to upload image",
              details:message,
          }, {status:500})

  }
};