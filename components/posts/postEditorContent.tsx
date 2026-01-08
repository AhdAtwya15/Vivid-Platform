"use client";
import  { useEffect, useState} from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

import { 
  Bold, Italic, Strikethrough, UnderlineIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Code, ImageIcon, LinkIcon,
  Undo, Redo,
  Sparkles,
  Plus,
  Minus,
  Wand2,
  Loader2
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PostFormValues } from "@/schemas";
import { Button } from "../ui/button";
import Image from "next/image";
import { Input } from "../ui/input";
import { IAiBtn, IGenerateType, ImprovementType} from "@/interfaces";
import { toast } from "sonner";
import { generateContent, improveContent } from "@/app/actions/gamini";
import { BarLoader } from "react-spinners";


interface IProps {
  form: UseFormReturn<PostFormValues>;
  onImageUpload: (type: "featured" | "content") => void;
   onEditorReady?: (editor: Editor) => void;
}

const PostEditorContent = ({ form, onImageUpload, onEditorReady }: IProps) => {
  const [isGenerating,setIsGenerating] = useState<boolean>(false);
  const [improvingType, setImprovingType] = useState<ImprovementType | null>(null);

  const [showLinkInput, setShowLinkInput] = useState<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);


  const { register,setValue, watch,formState:{errors} } = form;
  const watchedValues = watch();
  const hasTitle=watchedValues.title?.trim()
  
 

  const content = watch("content") || "";


 const aiBtns: IAiBtn[] = [
  {
    type: "enhance",
    icon: Sparkles,
    className: "border-green-700 dark:border-green-700  text-green-700 dark:text-green-700 hover:bg-green-700 dark:hover:bg-green-700 hover:text-white dark:hover:text-white"
  },
  {
    type: "expand",
    icon: Plus,
    className: "border-blue-500 dark:border-blue-500  text-blue-500 dark:text-blue-500 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white"
  },
  {
    type: "simplify",
    icon: Minus,
    className: "border-orange-600 dark:border-orange-600  text-orange-600 dark:text-orange-600 hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white"
  },
];
const aiBtnsColors: Record<ImprovementType, string> = {
  enhance: "#22c55e", 
  expand: "#3b82f6",  
  simplify: "#f59e0b", 
};


  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TiptapImage.configure({
        inline: true,
        allowBase64: true,
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-400 underline cursor-pointer',
        },
      }),
       Placeholder.configure({
      placeholder: "Tell your story... or use AI to generate content!",
    }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] text-gray-700 dark:text-white ',
      },
    },
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML());
    },
  });

  useEffect(() => {
  if (editor && onEditorReady) {
    onEditorReady(editor);
  }
}, [editor, onEditorReady]);

   const hasContent =
  editor &&
  !editor.isEmpty &&
  editor.getText().trim().length > 0;


  const colors = [
    "#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff",
    "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff",
    "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff",
    "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2",
    "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466",
  ];

  const handleImageUpload = () => {
    onImageUpload("content")
   
  };

  const setLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
      setShowLinkInput(false);
      setLinkUrl("");
    }
  };


  const handleContentWithAI = async (
  type: IGenerateType,
  improvementType?: ImprovementType
) => {
  const { title, content, category, tags } = watchedValues;

  if (type === "generate") {
    if (!title?.trim())
      return toast.error("Please add title to generate content");

    if (
      content &&
      content !== "<p><br></p>" &&
      !window.confirm("This will replace your existing content. Continue?")
    )
      return;

    setIsGenerating(true);
  } else {
    if (!content || content === "<p><br></p>")
      return toast.error("Please add some content to improve it");

   setImprovingType(improvementType ?? "enhance");

  }

  try {
    const result =
      type === "generate"
        ? await generateContent(title, category, tags)
        : await improveContent(content || "", improvementType ?? "enhance");


    if (result.success) {
      editor?.commands.setContent(result.content||"");
      setValue("content", result.content||"");
      toast.success(`Content ${type === "generate" ? "generated" : improvementType === "enhance" ? "enhanced" : improvementType === "expand" ? "expanded" : "simplified"} successfully!`);
    } else {
      toast.error(result.error || "Failed to process content with AI");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong, please try again later!");
  } finally {
    setIsGenerating(false);
    setImprovingType(null);

  }
};


  if (!editor) return null;

  return (
    <main className="max-w-4xl mx-auto px-5 py-7">
       <div className=" space-y-6">
        {
          watchedValues.featuredImage?(
            <div className="relative group">
              <Image
              src={watchedValues.featuredImage}
              alt="Featured Image"
               width={ 1200}
  height={ 630}
              className="w-full h-90 object-contain rounded-xl"
              />
              <div>
                <div className="absolute inset-0 bg-black/50 flex justify-center items-center  gap-4 p-2 text-gray-700 dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg">
                  <Button
                  variant={"secondary"}
                    onClick={()=>onImageUpload("featured")}
                    className="flex items-center gap-1 text-sm"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Change Image</span>
                  </Button>
                  <Button
                  variant={"destructive"}
                    onClick={() => setValue("featuredImage", "")}
                    className="flex items-center gap-1 text-sm"
                  >
                    Remove 
                  </Button>
                </div>
              </div>
              
            </div>
          )
          :
          (
            <button
        onClick={()=>onImageUpload("featured")}
        className="flex flex-col space-y-4 items-center justify-center w-full h-40 border-2 border-dashed border-slate-600 dark:border-gray-400 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl transition-all duration-300 group "
        >
          <ImageIcon className="h-12 w-12 text-gray-700 dark:text-white group-hover:text-slate-400 dark:group-hover:text-slate-400 transition-all duration-300"/>
          <div className="flex flex-col space-y-1">
            <p className="text-gray-700 dark:text-white group-hover:text-slate-400 dark:group-hover:text-slate-400 transition-all duration-300">Upload a featured image</p>
          <span className="text-xs text-slate-500">Upload and transform with AI</span>
          </div>
        </button>
          )
        }
        <div>
          <Input
            {...register("title")}
            placeholder="Post Title" 
            className=" bg-gray-100 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium  border-none p-5 py-7  placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          {errors.title &&(
            <p className="mt-2 text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div>
          {
            !hasContent?(
              <Button
              disabled={!hasTitle||isGenerating||!!improvingType}
              onClick={() => handleContentWithAI("generate")}
                variant={"outline"}
                className="w-full border border-emerald-700 text-emerald-700 flex gap-2"
              >
              
                {
                  isGenerating?(
                    <>
                     <Loader2 className="h-4 w-4 animate-spin" />
                      Generate Content with AI
                    </>
                   
                  ):
                  <>
                   <Wand2 className="h-4 w-4 " />
                    Generating Content with AI

                  </>
                  
                }
               


               
              </Button>
            )
            :(
            <div className="grid  sm:grid-cols-3 gap-3 w-full">
  {aiBtns.map((btn, index) => (

    <Button
      key={index}
      variant="outline"
      className={`flex gap-2 ${btn.className} transition-all duration-300`}
      onClick={() =>{
        setImprovingType(btn.type);
        handleContentWithAI("improve", btn?.type )}

      } 
      disabled={!!improvingType}

    >
      {improvingType === btn.type ? (
  <>
    <Loader2 className="h-4 w-4 animate-spin" />
    <span>
      {btn.type === "enhance"
        ? "Enhancing with AI"
        : btn.type === "expand"
        ? "Expanding with AI"
        : "Simplifying with AI"}
    </span>
  </>
) : (
  <>
    <btn.icon className="h-4 w-4" />
    <span>
      {btn.type === "enhance"
        ? "Enhance with AI"
        : btn.type === "expand"
        ? "Expand with AI"
        : "Simplify with AI"}
    </span>
  </>
)}

    </Button>

 
     
  ))}





</div>

            )
          }

          {isGenerating && (
           <div className="my-4">
             <BarLoader width={"100%"} color="#003C24"/>
            </div>
          )}
             {improvingType && (
    <div className="my-4 sm:col-span-3">
      <BarLoader width="100%" color={aiBtnsColors[improvingType]} />
    </div>
  )}

        </div>
        
         


        <div className="space-y-4">
          <div className="sticky top-0 z-30 bg-gray-50/60 dark:bg-[#003d248d] rounded-lg p-2 flex flex-wrap  xl:flex-nowrap gap-2 xl:gap-0  ">
        <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
          <Button
          size={"icon-sm"}
          variant={"ghost"}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
          size={"icon-sm"}
          variant={"ghost"}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center border-r border-slate-700 px-2">
          <select
            onChange={(e) => {
              const level = parseInt(e.target.value) as 1 | 2 | 3 | 0;
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }}
            className="bg-gray-200 dark:bg-[#171717]  text-gray-900 dark:text-white rounded px-2 py-1 text-sm"
          >
            <option value="0">Normal</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
          </select>
        </div>

        <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
          <Button
          size={"icon-sm"}
          variant={editor.isActive('bold') ? "default" : "ghost"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
            className="ml-2"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
          size={"icon-sm"}
          variant={editor.isActive('italic') ? "default" : "ghost"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
          size={"icon-sm"}
          variant={editor.isActive('underline') ? "default" : "ghost"}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
          size={"icon-sm"}
          variant={editor.isActive('strike') ? "default" : "ghost"}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </div>

        
        <div className="relative border-r border-slate-700 px-2">
          <button
         
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded text-white hover:bg-[#F5F5F5]   dark:hover:bg-[#132924] "
            title="Text Color"
          >
            <div 
              className="w-6 h-6 rounded border-[0.5px] border-slate-500" 
              style={{ backgroundColor: editor.getAttributes('textStyle').color || '#ffffff' }}
            />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-2 p-4 bg-gray-100 dark:bg-emerald-950  border border-gray-300 rounded-lg shadow-lg z-70">
              <div className="grid grid-cols-7 gap-x-6 gap-y-1 mr-4">
                {colors.map((color) => (
                

                    <button
                    key={color}
                  
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorPicker(false);
                    }}
                    className="w-5 h-5 rounded border border-slate-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
          <Button
          size={"icon-sm"}
          variant={editor.isActive({ textAlign: 'left' }) ? "default" : "ghost"}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Align Left"
            className="ml-2"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
          size={"icon-sm"}
          variant={editor.isActive({ textAlign: 'center' }) ? "default" : "ghost"}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
          size={"icon-sm"}
          variant={editor.isActive({ textAlign: 'right' }) ? "default" : "ghost"}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
          size={"icon-sm"}
          variant={editor.isActive({ textAlign: 'justify' }) ? "default" : "ghost"}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

  
        <div className="relative border-r border-slate-700 px-2">
          <Button
          size={"icon-sm"}
          variant={editor.isActive('link') ? "default" : "ghost"}
            onClick={() => setShowLinkInput(!showLinkInput)}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-2 p-3 bg-gray-100 dark:bg-emerald-950 border  rounded-lg shadow-lg z-50 min-w-[300px]">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter URL"
                className="w-full px-3 py-2 border border-slate-300 bg-em dark:border-emerald-900 rounded text-gray-700 dark:text-white text-sm mb-2"
                onKeyPress={(e) => e.key === 'Enter' && setLink()}
              />
              <div className="flex gap-2">
                <Button
                variant={"outline"}
                size={"lg"}
                className="flex-1"
                onClick={setLink}>
                   Save

                </Button>
                <Button
                
                size={"lg"}
                className="flex-1"
                  onClick={() => setShowLinkInput(false)}
                  >
                  Cancel
                </Button>
                
                
              </div>
            </div>
          )}
        </div>

       

        <div className=" flex items-center gap-1 border-r border-slate-700 pr-2">
        <Button
        variant={editor.isActive('blockquote') ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
          className="ml-2"
        >
          <Quote className="h-4 w-4" />
        </Button>
          <Button
          size={"icon-sm"}
          variant={editor.isActive('codeBlock') ? "default" : "ghost"}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
            className=""
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

  
        <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
          <Button
          size={"icon-sm"}
          variant={editor.isActive('orderedList') ? "default" : "ghost"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
            className="ml-2"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
          size={"icon-sm"}
          variant={editor.isActive('bulletList') ? "default" : "ghost"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button
        variant={"ghost"}
        
          onClick={handleImageUpload}
          title="Insert Image"
          className="ml-2"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="prose prose-lg max-w-none">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .ProseMirror {
          color: rgb(55, 65, 81) ;
          font-size: 1.125rem !important;
          line-height: 1.7 !important;
          min-height: 400px !important;
        }

.dark .ProseMirror {
  color: white;
}
        
        .ProseMirror:focus {
          outline: none;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          color: rgb(100, 116, 139);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          font-size: 16px !important;
          font-style: italic !important;
        }
        
        .ProseMirror h1 {
          font-size: 2.5rem !important;
          font-weight: 600 !important;
          color: rgb(17, 24, 39);
          margin: 1rem 0 !important;
        }
        
        .ProseMirror h2 {
          font-size: 2rem !important;
          font-weight: 600 !important;
          color: rgb(17, 24, 39);
          margin: 0.75rem 0 !important;
        }
        
        .ProseMirror h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          color: rgb(17, 24, 39);
          margin: 0.5rem 0 !important;
        }
          .dark .ProseMirror h1,
.dark .ProseMirror h2,
.dark .ProseMirror h3 {
  color: white;
}
        
        .ProseMirror blockquote {
          border-left: 4px solid #1f3b24 !important;
          background: #1f3b242a !important;
          color: rgb(55, 65, 81);
          padding: 0.75rem 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
          border-radius: 0.25rem !important;
        }
          .dark .ProseMirror blockquote  {
  color: white;
}
        
        .ProseMirror blockquote p {
          margin: 0 !important;
        }
        
        .ProseMirror a {
          color: #0303ad !important;
          text-decoration: underline !important;
        }
        
        .ProseMirror code {
          background: rgb(51, 65, 85) !important;
          color: rgb(248, 113, 113) !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
          font-family: monospace !important;
        }
        
        .ProseMirror pre {
          background: #282A35 !important;
          color: rgb(226, 232, 240) !important;
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          overflow-x: auto !important;
        }
        
        .ProseMirror pre code {
          background: transparent !important;
          color: inherit !important;
          padding: 0 !important;
        }
        
        .ProseMirror ul,
        .ProseMirror ol {
          color:rgb(17, 24, 39); 
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }

        .dark .ProseMirror ul,
.dark .ProseMirror ol {
  color: white;
}
        
        
        .ProseMirror ul {
          list-style-type: disc !important;
        }
        
        .ProseMirror ol {
          list-style-type: decimal !important;
        }
        
        .ProseMirror li {
          color:inherit;;
          display: list-item !important;
        }
        
        .ProseMirror ul li {
          list-style-type: disc !important;
        }
        
        .ProseMirror ol li {
          list-style-type: decimal !important;
        }
        
        .ProseMirror img {
         max-width: 700px;
  width: auto;
  height: auto;
  display: block;
  margin: 1rem 0;
  border-radius: 0.75rem;
}

      `}</style>

        </div>
       </div>

    </main>
  );
};

export default PostEditorContent;


