"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, GraduationCap, Lock, Mail, UserPlus, Fingerprint, BadgeCheck, Presentation } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Tabs as ShadTabs, TabsContent as ShadTabsContent, TabsList as ShadTabsList, TabsTrigger as ShadTabsTrigger } from "@/components/ui/tabs";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { registerUser, setSessionEmail } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('student');
  const [loginEmail, setLoginEmail] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    interests: '',
  });

  const logoData = PlaceHolderImages.find(img => img.id === 'app-logo');

  const handleLogin = (role: 'student' | 'admin') => {
    const emailToUse = role === 'student' ? loginEmail : adminEmail;
    
    if (!emailToUse) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email address.",
      });
      return;
    }

    setLoading(true);
    if (role === 'student') {
      setSessionEmail(emailToUse);
    }
    
    setTimeout(() => {
      router.push(`/dashboard/${role}`);
    }, 800);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.name || !signUpData.rollNumber || !signUpData.email) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      registerUser({
        name: signUpData.name,
        rollNumber: signUpData.rollNumber,
        email: signUpData.email,
        interests: signUpData.interests.split(',').map(i => i.trim()).filter(i => i !== ''),
      });

      toast({
        title: "Account Created",
        description: `Welcome ${signUpData.name}! You can now login.`,
      });
      
      setLoading(false);
      setLoginEmail(signUpData.email);
      setActiveTab('student'); // Switch back to login tab
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 font-body">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto h-24 w-24 relative">
            {logoData ? (
              <Image 
                src={logoData.imageUrl} 
                alt="SACC Wallet Logo" 
                fill 
                className="object-contain"
                data-ai-hint={logoData.imageHint}
              />
            ) : (
              <div className="h-full w-full bg-primary rounded-2xl flex items-center justify-center">
                <GraduationCap className="h-12 w-12 text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground font-headline flex flex-col items-center">
              <span className="text-accent">SACC</span>
              <span className="text-primary -mt-2">WALLET</span>
            </h1>
            <p className="text-muted-foreground font-medium">MITS Gwalior PDC Evaluation System</p>
          </div>
        </div>

        <Card className="border-border shadow-xl">
          <CardHeader>
            <CardTitle>{activeTab === 'register' ? 'Create Student Account' : 'Sign In'}</CardTitle>
            <CardDescription>
              {activeTab === 'register' ? 'Join the MITS digital credentialing platform' : 'Enter your credentials to access your dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ShadTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <ShadTabsList className="grid grid-cols-3 w-full mb-6">
                <ShadTabsTrigger value="student" className="flex items-center gap-2">
                  <GraduationCap className="h-3 w-3" /> Login
                </ShadTabsTrigger>
                <ShadTabsTrigger value="admin" className="flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3" /> Admin
                </ShadTabsTrigger>
                <ShadTabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="h-3 w-3" /> Join
                </ShadTabsTrigger>
              </ShadTabsList>
              
              <ShadTabsContent value="student" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-s">Student Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email-s" 
                      placeholder="enrollment@mits.edu" 
                      className="pl-10" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pass-s">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="pass-s" type="password" placeholder="••••••••" className="pl-10" />
                  </div>
                </div>
                <Button 
                  className="w-full h-11 font-bold text-lg" 
                  onClick={() => handleLogin('student')}
                  disabled={loading}
                >
                  {loading ? "Authenticating..." : "Login as Student"}
                </Button>
              </ShadTabsContent>

              <ShadTabsContent value="admin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-a">Admin ID</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email-a" 
                      placeholder="admin@mits.edu" 
                      className="pl-10"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pass-a">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="pass-a" type="password" placeholder="••••••••" className="pl-10" />
                  </div>
                </div>
                <Button 
                  className="w-full h-11 font-bold text-lg" 
                  onClick={() => handleLogin('admin')}
                  disabled={loading}
                >
                  {loading ? "Authenticating..." : "Login as Admin"}
                </Button>
              </ShadTabsContent>

              <ShadTabsContent value="register" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <div className="relative">
                      <Fingerprint className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="reg-name" 
                        placeholder="John Doe" 
                        className="pl-10" 
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reg-roll">Roll Number</Label>
                    <div className="relative">
                      <BadgeCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="reg-roll" 
                        placeholder="0901CSXXXXXX" 
                        className="pl-10" 
                        value={signUpData.rollNumber}
                        onChange={(e) => setSignUpData({...signUpData, rollNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="reg-email" 
                        type="email"
                        placeholder="john@mits.edu" 
                        className="pl-10" 
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="reg-interests">Interests (Comma separated)</Label>
                    <Input 
                      id="reg-interests" 
                      placeholder="Coding, Debate, Music" 
                      value={signUpData.interests}
                      onChange={(e) => setSignUpData({...signUpData, interests: e.target.value})}
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full h-11 font-bold text-lg mt-2" 
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                </form>
              </ShadTabsContent>
            </ShadTabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border pt-6">
            <p className="text-xs text-muted-foreground text-center">
              Protected by MITS Academic Security. 
              Unauthorized access is monitored.
            </p>
          </CardFooter>
        </Card>

        <div className="text-center pt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-primary gap-2 font-bold"
            onClick={() => router.push('/presentation')}
          >
            <Presentation className="h-4 w-4" />
            View Project Presentation
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
