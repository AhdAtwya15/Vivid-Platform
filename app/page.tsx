"use client"
import { Button } from "@/components/ui/button";
import MouseMoving from "@/components/ui/mouseMoving";
import { ArrowRight, CheckCircle, Copyright, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { features, platformTabs, socialProofStats, testimonials } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";


export default function Home() {
  const[activeTab,setActiveTab]=useState(0)


  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 dark:bg-linear-to-br from-emerald-950/50 via-emerald-900/50 to-black/10 animate-pulse"/>
      <MouseMoving/>

      <section className="relative px-4 sm:px-6 z-10 mt-30 md:mt-40 lg:mt-15">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-8 lg:gap-12 ">
          <div className="text-center lg:text-left space-y-6 sm:space-y-8 ">
            <div className="space-y-4 sm:space-y-6 mt-5">
              <h1 className="font-black leading-none tracking-tight text-7xl lg:text-8xl">
                <div className="text-emerald-950 dark:text-white">Create.</div>
                <div className="italic text-emerald-700 font-medium">Share.</div>
                <div className="bg-linear-to-br from-emerald-950 via-emerald-900 to-black/50  text-transparent bg-clip-text">Impact.</div>
              </h1>
              <p className="text-emerald-950 dark:text-white leading-relaxed max-w-2xl md:max-w-none text-lg sm:text-xl md:text-2xl font-light">
              An intelligent platform that converts your ideas into
                <span className="text-emerald-700 font-semibold"> engaging content </span>
              and helps you scale your creator journey.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center w-full">
              <Link href={"/dashboard"}>
                <Button size={"xl"} variant={"primary"}
                className="rounded-full w-full sm:w-auto">
                  Start Creating for Free
                  <ArrowRight className="h-4 w-4"/>
                </Button>
              </Link>
              <Link href={"/feed"}>
                <Button size={"xl"} variant={"outline"}
                className="rounded-full w-full sm:w-auto">
                  Explore the Feed
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <Image
            src="https://ik.imagekit.io/7xylxjvvl/vivid/vividLanding.png"
            alt="vivid banner"
            width={500}
            height={700}
            priority
            className="w-full h-auto object-contain rounded-lg mt-10 md:mt-15  "
            />
          </div>
        </div>
      </section>

      <section id="features"
      className="relative z-10 mt-15 lg:mt-25 py-20 sm:py-25 px-4 bg-linear-to-br from-gray-200/50 to-gray-100/50 dark:bg-linear-to-br dark:from-emerald-950/10 dark:to-emerald-900/50 ">
      <div className="max-w-7xl mx-auto ">
        <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4">
          <h2 className="bg-linear-to-r from-emerald-950 via-emerald-900 to-black/50 text-transparent bg-clip-text dark:text-white  font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl pb-5">
            Everything you need
          </h2>
          <p className="max-w-3xl mx-auto px-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 ">
              From AI-powered writing assistance to advanced analytics,
              we&apos;ve built the complete toolkit for modern creators.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-20">
          { features.map((feature,index)=>(
            <Card key={index} className="group transition-all duration-300 hover:scale-95 sm:hover:scale-105 card-glass p-5 text-center">
              <CardContent className="space-y-6 p-8">
                <div className={` mx-auto w-15 h-15 bg-linear-to-r ${feature.color} rounded-xl flex justify-center items-center transition-all duration-300 group-hover:scale-110 `}>
                  <feature.icon className="w-7 h-7 text-white "/>
                </div>
                <CardTitle className="text-lg sm:text-xl ">
                  {feature.title}
                </CardTitle>
                <CardDescription className="max-w-2xl text-gray-700 dark:text-gray-300">
                  {feature.desc}
                </CardDescription>
              </CardContent>
            </Card>
          ))
          }
        </div>
      </div>
      </section>

      <section
      className="relative z-10  py-20 sm:py-25 px-4  ">
      <div className="max-w-7xl mx-auto ">
        <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4 ">
          <h2 className="bg-linear-to-r from-emerald-950 via-emerald-900 to-black/50 text-transparent bg-clip-text dark:text-white  font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl pb-5">
            How it works
          </h2>
          <p className="max-w-4xl mx-auto px-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 ">
              Three powerful modules working together to supercharge your
              content creation.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 mt-20 ">
          <div className="lg:w-1/3">
            <div className="space-y-5">
              { platformTabs.map((platform,index)=>(
                <Button key={index}
                variant={activeTab===index?"outline":"ghost"}
                onClick={()=>setActiveTab(index)}
                className="w-full h-auto p-7 justify-start"
                >
                  <div className="flex gap-4 justify-center items-center ">
                    <div className="w-13 h-13 rounded-2xl flex justify-center items-center  bg-linear-to-r from-emerald-700 via-emerald-600 to-emerald-400">
                      <platform.icon className="text-white"/>
                    </div>
                    <div className="text-gray-700 dark:text-white text-lg font-bold" >
                      {platform.title}

                    </div>

                  </div>


                </Button>
              ))

              }

            </div>

          </div>
          <div className="lg:w-2/3" >
            <Card  className="bg-gray-100/10 dark:bg-emerald-950/20 border-gray-300  dark:border-emerald-900">
              <CardHeader className="space-y-3 ">
          
                <CardTitle className="text-gray-700 dark:text-white text-lg sm:text-xl lg:text-2xl font-bold ">
                  {platformTabs[activeTab].title}
                </CardTitle>
                <CardDescription className="max-w-3xl text-lg text-gray-700 dark:text-gray-300">
                  {platformTabs[activeTab].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3 place-items-start" >
                { platformTabs[activeTab].features.map((feature,index)=>(
                  <div key={index} className="flex justify-center items-center gap-3 mt-5">
                    <CheckCircle className="w-5 h-5 text-green-500"/>
                    <span >
                      {feature}
                    </span>
                  </div>
                ))
                }
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </section>

      <section 
      className="relative z-10 mt-15 lg:mt-25 py-20 sm:py-25 px-4 bg-linear-to-br from-gray-200/50 to-gray-100/50 dark:bg-linear-to-br dark:from-emerald-950/10 dark:to-emerald-900/50 ">
      <div className="max-w-7xl mx-auto ">
        <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4">
          <h2 className="bg-linear-to-r from-emerald-950 via-emerald-900 to-black/50 text-transparent bg-clip-text dark:text-white  font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl pb-5">
            Loved by creators worldwide
          </h2>
         
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mt-15">
          { socialProofStats.map((stats,index)=>(
            <div key={index} className="flex flex-col gap-3 sm:gap-4 justify-center items-center">
              <div className={` mx-auto w-15 h-15 lg:w-17 lg:h-17  bg-linear-to-r from-emerald-700 via-emerald-600 to-emerald-400 rounded-xl flex justify-center items-center transition-all duration-300 group-hover:scale-110 `}>
                  <stats.icon className="w-8 h-8 lg:w-10 lg:h-10  text-white "/>
                  
              </div >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-700 dark:text-white ">{stats.metric}</span>
              
              <span className="text-lg text-gray-700 dark:text-gray-300">{stats.label}</span>

              
            </div>
          ))
          }
        </div>
      </div>
      </section>

      <section id="testimonials"
      className="relative z-10  py-20 sm:py-25 px-4  ">
      <div className="max-w-7xl mx-auto ">
        <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4 ">
          <h2 className="bg-linear-to-r from-emerald-950 via-emerald-900 to-black/50 text-transparent bg-clip-text dark:text-white  font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl pb-5">
            What creators say
          </h2>
  
        
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-20">
          { testimonials.map((test,index)=>(
            <Card key={index} className="group transition-all duration-300 hover:scale-95 sm:hover:scale-105 card-glass p-5 ">
              <CardContent className="space-y-6 p-8">
                <div className="flex gap-1">
                  {Array.from({ length: test.rating }, (_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                 <CardDescription className="max-w-2xl text-gray-700 dark:text-gray-200">
                  {test.content}
                </CardDescription>

                <div className="flex gap-3  items-center">
                   <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={`https://images.unsplash.com/photo-${test.imageId}?auto=format&fit=crop&w=100&h=100&q=80`} 
                    alt={test.name}
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-base mt-2">
                  {test.name}
                  <p className=" flex flex-col  text-gray-500 gap-1">
                    <span className="text-sm">{test.role} at</span>

                    <Badge variant={"secondary"}>
                {test.company}
                
              </Badge>
                    
                    
                  </p>
                </CardTitle>

                </div>
               
               
              </CardContent>
            </Card>
          ))
          }
        </div>
      </div>
      </section>

      <section 
      className="relative z-10 mt-15 lg:mt-25 py-20 sm:py-25 px-4 bg-linear-to-br from-gray-200/50 to-gray-100/50 dark:bg-linear-to-br dark:from-emerald-950/10 dark:to-emerald-900/50 ">
      <div className="max-w-7xl mx-auto ">
        <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4">
          <h2 className="bg-linear-to-r from-emerald-950 via-emerald-900 to-black/50 text-transparent bg-clip-text dark:text-white  font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl pb-5">
            Ready to create?
          </h2>
          <p className="max-w-3xl mx-auto px-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 ">
              Join thousands of creators who are already building their audience and growing their business with our AI-powered platform.
          </p>
        </div>
        <div className=" flex flex-col sm:flex-row gap-6 justify-center  items-center w-full mt-10">
              <Link href={"/dashboard"}>
                <Button size={"xl"} variant={"primary"}
                className="rounded-full w-full sm:w-auto">
                  Start Creating for Free
                  <ArrowRight className="h-4 w-4"/>
                </Button>
              </Link>
              <Link href={"/feed"}>
                <Button size={"xl"} variant={"outline"}
                className="rounded-full w-full sm:w-auto">
                  Explore the Feed
                </Button>
              </Link>
        </div>
      </div>
      </section>

      <footer 
      className="relative z-10 pt-4 px-4  ">
      <div className="max-w-7xl mx-auto ">
        <div className="text-center ">
          <h6 className=" flex gap-2 justify-center items-center bg-linear-to-r from-emerald-950 via-emerald-900 to-black/50 text-transparent bg-clip-text dark:text-white  font-semibold text-md sm:text-md md:text-md lg:text-xl pb-5">
           <span> Made with love by vivid </span>
           <span><Copyright className="w-4 h-4 text-gray-700  dark:text-white"/></span>
          </h6>
        </div>
        
      </div>
      </footer>



    </main>
  );
}