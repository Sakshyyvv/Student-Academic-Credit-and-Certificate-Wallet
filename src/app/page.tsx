
"use client"

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Wallet, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  Users, 
  Zap, 
  Presentation,
  Check
} from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const router = useRouter();
  const logoData = PlaceHolderImages.find(img => img.id === 'app-logo');

  const features = [
    {
      title: "Digital Achievement Wallet",
      description: "Securely store and track all your extracurricular certificates in one persistent digital vault.",
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "AI Smart Path",
      description: "Receive personalized activity recommendations powered by Gemini AI to bridge your credit gaps.",
      icon: Sparkles,
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      title: "Unified Scorecard",
      description: "Real-time calculation of Academic and Extra Credits (PDC) for a holistic view of your progress.",
      icon: Award,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Admin Evaluation",
      description: "Streamlined verification queue for faculty with automated credit assignment and student lookups.",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    }
  ];

  const stats = [
    { label: "PDC Categories", value: "C1-C6" },
    { label: "Target Score", value: "160+" },
    { label: "AI Engine", value: "Gemini 2.5" },
    { label: "Institution", value: "MITS" }
  ];

  return (
    <div className="min-h-screen bg-background font-body selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="h-8 w-8 relative bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-black text-xl tracking-tight">
              SACC <span className="text-primary">WALLET</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Button variant="ghost" className="font-bold hidden md:flex" onClick={() => router.push('/presentation')}>
              Presentation
            </Button>
            <Button className="font-black gap-2" onClick={() => router.push('/login')}>
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-widest border border-border">
              <Zap className="h-3 w-3 text-accent fill-accent" /> Digital Credentialing for MITS Gwalior
            </div>
            <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-[0.9] text-foreground">
              The Future of <span className="text-primary">Academic</span> Credits.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed font-medium">
              A high-fidelity platform to track, verify, and enhance your Professional Development Credits using state-of-the-art AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-lg font-black gap-2 group" onClick={() => router.push('/login')}>
                Launch Platform <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-black gap-2" onClick={() => router.push('/presentation')}>
                <Presentation className="h-5 w-5" /> View Case Study
              </Button>
            </div>
          </div>

          <div className="relative aspect-square lg:aspect-auto lg:h-[600px] animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl rounded-full opacity-50" />
            <div className="relative h-full w-full rounded-3xl border-4 border-white/50 bg-card/40 backdrop-blur-sm overflow-hidden shadow-2xl flex items-center justify-center p-8">
               <div className="w-full max-w-md space-y-6">
                 {/* Visual Mockup of Score Card */}
                 <div className="p-6 rounded-2xl bg-background border border-border shadow-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Live Credit Wallet</span>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-5xl font-black text-primary">168.5</div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold">
                         <span className="text-muted-foreground">PDC Progress</span>
                         <span className="text-primary">82%</span>
                       </div>
                       <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full w-[82%] bg-primary" />
                       </div>
                    </div>
                 </div>
                 {/* Visual Mockup of AI suggestion */}
                 <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex gap-4 items-start shadow-md">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Sparkles className="h-5 w-5 text-accent" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-accent">AI Recommendation</p>
                      <p className="text-sm font-bold">Try the 'National Coding Hackathon' to bridge C2 credits.</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30 border-y border-border px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary">Core Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-black font-headline tracking-tight">Built for Academic Excellence</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h4 className="text-xl font-black mb-3">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Institutional Banner */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <GraduationCap className="h-64 w-64" />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
                Integrated with MITS Gwalior Academic Standards
              </h2>
              <ul className="space-y-4">
                {["Category C1-C6 Logic", "Real-time Verification", "Departmental Alignment"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-lg">
                    <CheckCircle2 className="h-6 w-6 text-accent" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
                  <div className="text-3xl font-black text-accent">{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-white/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Authors / Footer */}
      <footer className="py-20 border-t border-border px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-black text-2xl tracking-tight">SACC <span className="text-primary">WALLET</span></span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Empowering students through digital excellence and AI-guided career pathing at MITS Gwalior.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Developed By</p>
                <p className="font-bold text-foreground">Shourya Dubey & Sakshi Verma</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">© 2024 MITS Digital Initiatives. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
