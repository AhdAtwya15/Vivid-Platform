import { ImageTransformation } from "@/interfaces";

export const uploadToImageKit = async (file: File,fileName:string) => {
    try{
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);

        const res=await fetch("/api/imagekit/upload",
            {
                method: "POST",
                body: formData,
            }
        )

        if(!res.ok)
        {
            const errData=await res.json()
            throw new Error(errData.message || "Failed to upload image")
        }

        const result=await res.json()

        return{
            success:true,
            data:{
                fileId:result.fileId,
                name:result.name,
                url:result.url,
                width:result.width,
                height:result.height,
                size:result.size
            }
        }
    }
    catch(error)
    {
        console.error("ImageKit upload error:", error);
         const message =
      error instanceof Error ? error.message : "Unknown error occurred";
        return{
            success:false,
            error:message,
        }
      
    }
};

function transformToParam(transform: ImageTransformation): string {
    const params: string[] = [];


    if ("overlayText" in transform && transform.overlayText) {
        const layer: string[] = [
            "l-text",
            `i-${encodeURIComponent(transform.overlayText)}`,
        ];

        if (transform.overlayTextFontSize) {
            layer.push(`fs-${transform.overlayTextFontSize}`);
        }

        if (transform.overlayTextColor) {
            layer.push(`co-${transform.overlayTextColor}`);
        }

        if (transform.overlayTextPadding) {
            layer.push(`pa-${transform.overlayTextPadding}`);
        }

        if (transform.overlayBackground) {
            layer.push(`bg-${transform.overlayBackground}`);
        }

        if (transform.gravity) {
            layer.push(`lfo-${transform.gravity}`);
        }

        layer.push("l-end");
        return layer.join(",");
    }

    if ("width" in transform && transform.width) {
        params.push(`w-${transform.width}`);
    }

    if ("height" in transform && transform.height) {
        params.push(`h-${transform.height}`);
    }

    


    if ("effect" in transform) {
        switch (transform.effect) {
            case "grayscale":
                params.push("e-grayscale");
                break;

          
        }
    }


    if ("blur" in transform && transform.blur !== undefined && transform.blur > 0) {
        params.push(`bl-${transform.blur}`);
    }

    if ("opacity" in transform && transform.opacity !== undefined) {
        params.push(`o-${transform.opacity}`);
    }

    if ("rotate" in transform && transform.rotate !== undefined) {
        params.push(`rt-${transform.rotate}`);
    }



    if ("radius" in transform && transform.radius !== undefined) {
        params.push(`r-${transform.radius}`);
    }

    if ("trim" in transform && transform.trim !== undefined) {
        params.push(`t-${transform.trim}`);
    }

    if ("borderWidth" in transform && "borderColor" in transform && 
        transform.borderWidth && transform.borderColor) {
        params.push(`b-${transform.borderWidth}_${transform.borderColor}`);
    }

    return params.join(",");
}

export const createTransformedUrl = (
    src: string,
    transformations: ImageTransformation[] = []
): string => {
    if (!transformations.length) return src;

  
    const textOverlays: ImageTransformation[] = [];
    const regularTransforms: ImageTransformation[] = [];

    transformations.forEach(transform => {
        if ("overlayText" in transform) {
            textOverlays.push(transform);
        } else {
            regularTransforms.push(transform);
        }
    });

    const transformParts: string[] = [];


    if (regularTransforms.length > 0) {
        const regularParams = regularTransforms
            .map(t => transformToParam(t))
            .filter(Boolean)
            .join(",");
        
        if (regularParams) {
            transformParts.push(regularParams);
        }
    }
    textOverlays.forEach(overlay => {
        const param = transformToParam(overlay);
        if (param) transformParts.push(param);
    });

    const transformParams = transformParts.join(":");

    if (!transformParams) return src;
    if (src.includes("/tr:")) {
        
        return src.replace(/\/tr:[^/]*\//, `/tr:${transformParams}/`);
    }

   
    const urlParts = src.split("/");
    const filename = urlParts.pop();
    urlParts.push(`tr:${transformParams}`);
    urlParts.push(filename || "");
    
    return urlParts.join("/");
};

