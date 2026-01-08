import { ImageKitFile, ImageTransformation, ITransformationFeatures } from "@/interfaces";
import { TransformationFormValues, transformationSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Slider } from "./slider";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { useDropzone } from "react-dropzone";
import { Check, ImageIcon, Loader, Upload, Wand, RotateCcw } from "lucide-react";
import { FadeLoader } from "react-spinners";
import { toast } from "sonner";
import { createTransformedUrl, uploadToImageKit } from "@/lib/imageKit";
import { Badge } from "./badge";
import { Button } from "./button";
import Image from "next/image";

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    onImageSelect: (ImageData: ImageKitFile) => void;
    title: string;
}

const ImageModal = ({ isOpen, onClose, onImageSelect, title }: IProps) => {
    const [uploadedImage, setUploadedImage] = useState<ImageKitFile | null>(null);
    const [transformedImage, setTransformedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isTransforming, setIsTransforming] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<"upload" | "transform" | string>("upload");

    const ASPECT_RATIOS: ITransformationFeatures[] = [
        { label: "Original", value: "original" },
        { label: "Square (1:1)", value: "1:1", width: 400, height: 400 },
        { label: "Landscape (16:9)", value: "16:9", width: 800, height: 450 },
        { label: "Portrait (4:5)", value: "4:5", width: 400, height: 500 },
        { label: "Story (9:16)", value: "9:16", width: 450, height: 800 },
        { label: "Custom", value: "custom" },
    ];


    const TEXT_POSITIONS: ITransformationFeatures[] = [
        { label: "Center", value: "center" },
        { label: "Top Left", value: "top_left" },
        { label: "Top Right", value: "top_right" },
        { label: "Bottom Left", value: "bottom_left" },
        { label: "Bottom Right", value: "bottom_right" },
        { label: "Top", value: "top" },
        { label: "Right", value: "right" },
        { label: "Bottom", value: "bottom" },
        { label: "Left", value: "left" },
    ];

    const form = useForm<TransformationFormValues>({
        resolver: zodResolver(transformationSchema),
        defaultValues: {
            aspectRatio: "original",
            customWidth: 800,
            customHeight: 600,
            smartCropFocus: "auto",
            textOverlay: "",
            textFontSize: 50,
            textColor: "#ffffff",
            textPosition: "center",
            borderWidth: 0,
            grayscale: false,
        }
    });

    const { watch, setValue, reset } = form;
    const watchedValues = watch();

    const onReset = () => {
        setUploadedImage(null);
        setTransformedImage(null);
        setActiveTab("upload");
        reset();
    };

    const handleCloseModal = () => {
        onClose();
        onReset();
    };

    const resetTransformations = () => {
        reset();
        if (uploadedImage?.url) {
            setTransformedImage(uploadedImage.url);
            toast.success("Transformations reset");
        }
    };

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image file size should not exceed 10MB");
            return;
        }
        
        setIsUploading(true);
        try {
            const fileName = `post-image-${Date.now()}.${file.name}`;
            const res = await uploadToImageKit(file, fileName);

            if (res.success) {
                setUploadedImage(res.data || null);
                setTransformedImage(res.data?.url || null);
                setActiveTab("transform");
                toast.success("Image uploaded successfully");
            } else {
                toast.error(res.error || "Failed to upload image");
            }
        } catch (err) {
            console.error("Error uploading image:", err);
            toast.error("Upload failed. Please try again later");
        } finally {
            setIsUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
        multiple: false
    });

    const handleSelectImage = () => {
        if (transformedImage) {
            onImageSelect({
                url: transformedImage,
                originalUrl: uploadedImage?.url,
                fileId: uploadedImage?.fileId || "",
                name: uploadedImage?.name || "",
                width: uploadedImage?.width || 0,
                height: uploadedImage?.height || 0,
            });
        }
        onClose();
        onReset();
    };

    const onApplyTransformations = async () => {
        if (!uploadedImage) return;
        setIsTransforming(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const transformations: ImageTransformation[] = [];

    
            if (watchedValues.aspectRatio !== "original") {
                const focus = watchedValues.smartCropFocus;

                if (watchedValues.aspectRatio === "custom") {
                    transformations.push({
                        width: watchedValues.customWidth,
                        height: watchedValues.customHeight,
                        focus,
                        cropMode: watchedValues.cropMode,
                    });
                } else {
                    const ratio = ASPECT_RATIOS.find(
                        (r) => r.value === watchedValues.aspectRatio
                    );
                    if (ratio?.width && ratio?.height) {
                        transformations.push({
                            width: ratio.width,
                            height: ratio.height,
                            focus,
                            cropMode: watchedValues.cropMode,
                        });
                    }
                }
            }
            if (watchedValues.textOverlay?.trim()) {
                transformations.push({
                    overlayText: watchedValues.textOverlay,
                    overlayTextFontSize: watchedValues.textFontSize,
                    overlayTextColor: watchedValues.textColor?.replace("#", "") ?? "ffffff",
                    overlayTextPadding: watchedValues.textPadding,
                    overlayBackground: watchedValues.textBackground,
                    gravity: watchedValues.textPosition,
                });
            }

         

            if (watchedValues.grayscale) {
                transformations.push({ effect: "grayscale" });
            }

            if (watchedValues.blur !== undefined && watchedValues.blur > 0) {
                transformations.push({ blur: watchedValues.blur });
            }
            
            if (watchedValues.opacity !== undefined && watchedValues.opacity !== 100) {
                transformations.push({ opacity: watchedValues.opacity });
            }
            
            if (watchedValues.rotate !== undefined && watchedValues.rotate !== 0) {
                transformations.push({ rotate: watchedValues.rotate });
            }
            
       
            if (watchedValues.radius) {
                transformations.push({ radius: watchedValues.radius });
            }
            
            if (watchedValues.trim !== undefined && watchedValues.trim > 0) {
                transformations.push({ trim: watchedValues.trim });
            }
            
            if (watchedValues.borderWidth && watchedValues.borderColor) {
                transformations.push({
                    borderWidth: watchedValues.borderWidth,
                    borderColor: watchedValues.borderColor.replace("#", ""),
                });
            }

          
            const transformedUrl = createTransformedUrl(uploadedImage.url, transformations);
            setTransformedImage(transformedUrl);
            toast.success("Transformations applied successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to apply transformations");
        } finally {
            setIsTransforming(false);
        }
    };

   return (
        <Dialog open={isOpen} onOpenChange={handleCloseModal}>
            <DialogContent className="max-w-7xl! h-[88vh]! overflow-y-auto flex flex-col">
                <DialogHeader>
                    <DialogTitle className="font-bold">{title}</DialogTitle>
                    <DialogDescription>
                        Upload an image and apply AI-powered transformations
                    </DialogDescription>
                </DialogHeader>
                <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                        <TabsTrigger value="transform" disabled={!uploadedImage}>Transform</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="mt-20">
                        <div {...getRootProps()} className="w-full p-8 border-2 border-dashed border-slate-600 dark:border-gray-400 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl transition-all duration-300 cursor-pointer">
                            <input {...getInputProps()} />
                            {isUploading ? (
                                <div className="flex flex-col space-y-4 items-center justify-center">
                                    <FadeLoader width={20} color="#0f330e" />
                                    <p className="text-gray-700 dark:text-white text-lg">Uploading Image...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-4 items-center justify-center">
                                    <Upload className="w-13 h-13 text-gray-500" />
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <p className="text-gray-700 dark:text-white text-lg">
                                            {isDragActive ? "Drop the image here" : "Drag & drop an image here"}
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-60 sm:max-w-xl text-center">
                                            or click to select a file (JPG, PNG, WebP, GIF - Max 10MB)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {uploadedImage && (
                            <div className="flex flex-col items-center gap-4 mt-5">
                                <Badge variant="secondary" className="flex items-center gap-1 bg-green-500/20 text-green-600 dark:text-green-300  border-green-500/30">
                                    <Check className="w-4 h-4" />
                                    Image uploaded successfully
                                </Badge>
                                <div className="text-sm text-slate-400">
                                    {uploadedImage.width}x{uploadedImage.height} • {Math.round((uploadedImage?.size || 0) / 1024)} KB
                                </div>
                                <Button 
                                    variant="primary" 
                                    onClick={() => setActiveTab("transform")}
                                    className="flex items-center gap-2"
                                >
                                    <Wand className="w-4 h-4" />
                                    Transform Image
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="transform">
                        <div className="grid lg:grid-cols-2 gap-6 lg:h-[65vh]">
    
                            <div className="space-y-5 overflow-y-auto p-4 max-h-[50vh] lg:max-h-[65vh]">
                              
                                <div className="space-y-3">
                                    <h3 className="text-md font-semibold flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        Resize & Crop
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-3">
                                            <Label>Aspect Ratio</Label>
                                            <Select
                                                value={watchedValues.aspectRatio}
                                                onValueChange={(value) => setValue("aspectRatio", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ASPECT_RATIOS.map((ratio) => (
                                                        <SelectItem key={ratio.value} value={ratio.value}>
                                                            {ratio.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {watchedValues.aspectRatio === "custom" && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label>Width</Label>
                                                    <input
                                                        type="number"
                                                        {...form.register("customWidth", { valueAsNumber: true })}
                                                        className="w-full p-2 border rounded-md bg-background"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Height</Label>
                                                    <input
                                                        type="number"
                                                        {...form.register("customHeight", { valueAsNumber: true })}
                                                        className="w-full p-2 border rounded-md bg-background"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        
                                    </div>
                                </div>

                            
                                <div className="space-y-3">
                                    <h3 className="text-md font-semibold flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        Text Overlay
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            <Label>Text</Label>
                                            <Textarea
                                                {...form.register("textOverlay")}
                                                placeholder="Enter text to overlay"
                                            />
                                        </div>

                                        {watchedValues.textOverlay && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label>Font Size</Label>
                                                    <input
                                                        type="number"
                                                        {...form.register("textFontSize", { valueAsNumber: true })}
                                                        className="w-full p-2 border rounded-md bg-background"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Text Color</Label>
                                                    <input
                                                        type="color"
                                                        {...form.register("textColor")}
                                                        className="w-full h-10 p-1 border rounded-md bg-background"
                                                    />
                                                </div>
                                                <div className="col-span-2 space-y-2">
                                                    <Label>Text Position</Label>
                                                    <Select
                                                        value={watchedValues.textPosition}
                                                        onValueChange={(value: "center" | "top" | "bottom" | "right" | "left" | "top_left" | "top_right" | "bottom_left" | "bottom_right") => setValue("textPosition", value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TEXT_POSITIONS.map((position) => (
                                                                <SelectItem key={position.value} value={position.value}>
                                                                    {position.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                              
                                <div className="space-y-3">
                                    <h3 className="text-md font-semibold flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        Effect
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                {...form.register("grayscale")}
                                                id="grayscale"
                                                className="h-4 w-4"
                                            />
                                            <Label htmlFor="grayscale" className="text-sm">
                                                Grayscale
                                            </Label>
                                        </div>

                                      

                                        
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-md font-semibold flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        Advanced
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="space-y-3">
                                            <Label>Blur: {watchedValues.blur || 0}</Label>
                                            <Slider
                                                min={0}
                                                max={100}
                                                step={1}
                                                onValueChange={(value) => setValue("blur", value[0])}
                                                value={[watchedValues.blur || 0]}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Opacity: {watchedValues.opacity !== undefined ? watchedValues.opacity : 100}%</Label>
                                            <Slider
                                                min={0}
                                                max={100}
                                                step={1}
                                                onValueChange={(value) => setValue("opacity", value[0])}
                                                value={[watchedValues.opacity !== undefined ? watchedValues.opacity : 100]}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Rotate: {watchedValues.rotate || 0}°</Label>
                                            <Slider
                                                min={0}
                                                max={360}
                                                step={1}
                                                onValueChange={(value) => setValue("rotate", value[0])}
                                                value={[watchedValues.rotate || 0]}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Border Width</Label>
                                            <input
                                                type="number"
                                                {...form.register("borderWidth", { valueAsNumber: true })}
                                                className="w-full p-2 border rounded-md bg-background"
                                                placeholder="Border width in pixels"
                                            />
                                        </div>

                                        {Number.isFinite(watchedValues.borderWidth) &&
                                        watchedValues.borderWidth !== undefined && watchedValues.borderWidth > 0 && (
                                            <div className="space-y-3">
                                                <Label>Border Color</Label>
                                                <input
                                                    type="color"
                                                    {...form.register("borderColor")}
                                                    className="w-full h-10 p-1 border rounded-md bg-background"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button 
                                    variant={"primary"}
                                        onClick={()=>{
                                          onApplyTransformations();
                                          console.log("Transformations applied",transformedImage);
                                        }}
                                          
                                        disabled={isTransforming}
                                        className="flex-1 flex items-center gap-2"
                                    >
                                        {isTransforming ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Applying...
                                            </>
                                        ) : (
                                            <>
                                                <Wand className="w-4 h-4" />
                                                Apply
                                            </>
                                        )}
                                    </Button>
                                    
                                    <Button 
                                        onClick={resetTransformations}
                                        variant="outline"
                                        disabled={isTransforming}
                                        className="flex items-center gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reset
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-5 flex flex-col h-[50vh] lg:h-[65vh]">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    Preview
                                </h3>
                                
                                {transformedImage && (
                                    <div className="relative max-w-lg mx-auto  flex-1 flex items-center justify-center bg-emerald-950/30 border border-emerald-900 rounded-lg p-4 min-h-[300px] lg:min-h-0">
                                      
                                            <Image
                                                src={transformedImage}
                                                alt="Transformed"
                                                className="w-full h-full object-contain rounded-lg"
                                                width={800}
                                                height={600}
                                                onError={() => {
                                                    toast.error("Failed to load image");
                                                    setTransformedImage(uploadedImage?.url || null);
                                                }}
                                            />
                                       
                                            {
                                              isTransforming&&
                                              (
                                                <div className="absolute inset-0 flex justify-center items-center bg-black/60 rounded-lg backdrop-blur-sm">
                                                <div className="bg-linear-to-r from-emerald-600/50 to-emerald-800/50 rounded-xl p-6 flex flex-col items-center gap-4 shadow-2xl">
                                                    <Loader className="w-8 h-8 text-white animate-spin" />
                                                    <span className="text-white font-semibold text-lg">
                                                        Applying transformations...
                                                    </span>
                                                    <span className="text-emerald-100 text-sm">
                                                        Please wait
                                                    </span>
                                                </div>
                                            </div>
                                              )
                                            }
                                       
                                    </div>
                                )}

                                {uploadedImage && transformedImage && !isTransforming && (
                                    <div className="space-y-4 text-center">
                                        <div className="text-slate-500 dark:text-slate-300 text-sm">
                                            Current image URL ready for use
                                        </div>
                                        <div className="flex justify-center gap-3">
                                            <Button 
                                                onClick={handleSelectImage}
                                                className="flex gap-2 items-center bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <Check className="w-4 h-4" />
                                                Use This Image
                                            </Button>
                                            <Button 
                                                variant="outline"
                                                onClick={handleCloseModal}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default ImageModal;

