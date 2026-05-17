
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  Database, 
  LayoutDashboard, 
  Award,
  Zap,
  ArrowRight,
  Home
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const SLIDES = [
  {
    title: "SACC Wallet",
    subtitle: "Digital Credentialing & PDC Evaluation System",
    description: "Empowering MITS Gwalior students with a unified, AI-enhanced platform for academic and professional growth.",
    icon: GraduationCap,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: "The Challenge",
    subtitle: "Fragmented Credit Tracking",
    description: "Manual PDC (Professional Development Credit) evaluation is slow, opaque, and often leaves students unaware of their progress or missing opportunities.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Unified Scorecard",
    subtitle: "Academic + Extra Credits",
    description: "A single 'Credit Wallet' that sums academic performance (Sem 1-8) and extracurricular achievements (C1-C6) into a comprehensive 160+ point score.",
    icon: LayoutDashboard,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "AI Smart Path",
    subtitle: "Personalized Recommendations",
    description: "Powered by Genkit & Gemini. Analyzes credit gaps in categories C1-C6 to suggest activities aligned with student interests like 'Coding' or 'Public Speaking'.",
    icon: Sparkles,
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    title: "The Student Wallet",
    subtitle: "Secure & Persistent Achievement Vault",
    description: "Students upload certificates as persistent Base64 Data URIs, tracking approval status and earned points in real-time.",
    icon: Award,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Admin Console",
    subtitle: "Efficiency for Evaluators",
    description: "Mr. Vivek Sharma can instantly lookup students by Roll Number (e.g. 0901CS231129) and approve submissions with auto-calculated credit values.",
    icon: ShieldCheck,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  },
  {
    title: "Category Logic (C1-C6)",
    subtitle: "Institutional Standards Enforcement",
    description: "Strict enforcement of MITS credit caps: C1 (8 pts), C2 (9 pts), C3 (10 pts), C4 (5 pts), C5 (6 pts), and C6/MOOCS (12 pts).",
    icon: Database,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    title: "Modern Tech Stack",
    subtitle: "Performance & Scalability",
    description: "Built with Next.js 15 (App Router), Tailwind CSS, and ShadCN. High-fidelity LocalStorage 'DB' simulation ready for Firestore migration.",
    icon: Home,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: "The Impact",
    subtitle: "Transparency & Excellence",
    description: "Reducing administrative overhead by 70% while giving students a clear, data-driven path to graduation and professional success.",
    icon: GraduationCap,
    color: "text-primary",
    bg: "bg-primary/10"
  }
];

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const next = () => setCurrentSlide((prev) => Math.min(prev + 1, SLIDES.length - 1));
  const prev = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  const slide = SLIDES[currentSlide];
  const progress = ((currentSlide + 1) / SLIDES.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col font-body selection:bg-primary/30">
      <header className="p-6 flex justify-between items-center border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-black text-xl tracking-tight">
            SACC <span className="text-primary">WALLET</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Slide {currentSlide + 1} of {SLIDES.length}
          </span>
          <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="gap-2 font-bold">
            <Home className="h-4 w-4" /> Exit
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-12">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="space-y-2">
              <div className={`w-fit p-3 rounded-2xl ${slide.bg} mb-4`}>
                <slide.icon className={`h-10 w-10 ${slide.color}`} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">
                {slide.subtitle}
              </h2>
              <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter leading-none">
                {slide.title}
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
              {slide.description}
            </p>
            
            <div className="flex gap-4 pt-4">
              {currentSlide === SLIDES.length - 1 ? (
                <Button size="lg" className="h-14 px-8 text-lg font-black gap-2 group" onClick={() => router.push('/login')}>
                  Launch Platform <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button size="lg" className="h-14 px-8 text-lg font-black gap-2" onClick={next}>
                  Next Slide <ChevronRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          <div className="hidden lg:block relative aspect-square animate-in fade-in zoom-in duration-1000 delay-300">
            <Card className="h-full w-full border-2 border-primary/20 shadow-2xl relative overflow-hidden bg-gradient-to-br from-card to-background">
               <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
               <CardContent className="h-full flex flex-col items-center justify-center text-center p-12 relative z-10">
                 <div className={`h-48 w-48 rounded-full ${slide.bg} flex items-center justify-center mb-8 border-4 border-white/10 shadow-inner`}>
                   <slide.icon className={`h-24 w-24 ${slide.color} opacity-80`} />
                 </div>
                 <div className="space-y-4">
                    <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
                    <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">MITS Gwalior Digital Initiative</p>
                 </div>
               </CardContent>
            </Card>
            <div className="absolute -top-6 -right-6 h-32 w-32 bg-accent/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-6 -left-6 h-32 w-32 bg-primary/20 blur-3xl rounded-full" />
          </div>
        </div>
      </main>

      <footer className="p-8 border-t border-border bg-card/50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prev} 
              disabled={currentSlide === 0}
              className="h-12 w-12 rounded-full border-2"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={next} 
              disabled={currentSlide === SLIDES.length - 1}
              className="h-12 w-12 rounded-full border-2"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex-1 w-full max-w-md space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Introduction</span>
              <span>Impact</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
            <span>By Shourya Dubey & Sakshi Verma</span>
            <div className="h-4 w-px bg-border" />
            <span>MITS Gwalior</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
