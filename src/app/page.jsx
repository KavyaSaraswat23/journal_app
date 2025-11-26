import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ChevronRightCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getDailyPrompts } from "./api/public";

// const features = [
//   {
//     icon: Book,
//     title: "Rich Text Editor",
//     description:
//       "Express yourself with a powerful editor supporting markdown, formatting, and more.",
//   },
//   {
//     icon: Sparkles,
//     title: "Daily Inspiration",
//     description:
//       "Get inspired with daily prompts and mood-based imagery to spark your creativity.",
//   },
//   {
//     icon: Lock,
//     title: "Secure & Private",
//     description:
//       "Your thoughts are safe with enterprise-grade security and privacy features.",
//   },
// ];

export default async function Home() {
  const advice = await getDailyPrompts();
  return (
    <div className="relative container mx-auto px-4 pt-16 pb-16">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl gradient-title">Your Space to Reflect <br /> Your Story To Tell</h1>
        <p className="text-lg md:text-2xl"> A writing app that disappears into your words.</p>
        <div className="relative">
          <div className="absoluteinsert-0 bg-gradient"/>
          <div className="bg-white rounded-2xl p-4 max-full mx-auto">
            <div className="border-b border-orange-100 pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600"/>
                <span className="text-orange-900 font-medium">Today's Entry</span>
              </div>
              <br />
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-200"></div>
                <div className="h-3 w-3 rounded-full bg-orange-300"></div>
                <div className="h-3 w-3 rounded-full bg-orange-400"></div>
              </div>
            </div>
              <div className="space-y-4 p-4">
                <h3 className="text-xl font-semibold text-orange-800">{advice}</h3>
                <Skeleton className="h-3 w-3/4 bg-orange-100 rounded"/>
                <Skeleton className="h-3 w-full bg-orange-100 rounded"/>
                <Skeleton className="h-3 w-2/3 bg-orange-100 rounded"/>
              </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button 
            variant="outline"
            className="px-8 py-6 rounded-full border-orange-600 text-orange-600 hover:bg-orange-100"
            >Start Writing <ChevronRightCircle /></Button>
          </Link>
          <Link href="#features">
            <Button 
            variant="outline"
            className="px-8 py-6 rounded-full border-orange-600 text-orange-600 hover:bg-orange-100"
            >Learn More</Button>
          </Link>
        </div>
      </div>
      <section id="features">
      {/* {features.map(())} */}
      </section>
    </div>
  );
}
