"use client"

import { useState, useEffect, useMemo } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { AdminApprovalPanel } from "@/components/admin-approval-panel";
import { ActivityHub } from "@/components/activity-hub";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PDCScoreCard } from "@/components/pdc-score-card";
import { MOCK_ADMIN, getStoredCertificates, saveCertificates, findUserByRoll, getStoredUsers } from "@/lib/mock-data";
import { DEFAULT_CATEGORY_RULES, calculatePDCScore } from "@/lib/pdc-logic";
import { Toaster } from "@/components/ui/toaster";
import { Users, FileCheck, AlertCircle, Settings2, Search, User, Award } from "lucide-react";
import { Certificate, User as UserType } from '@/lib/types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('admin-dashboard');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchRoll, setSearchRoll] = useState('');
  const [foundStudent, setFoundStudent] = useState<UserType | null>(null);

  useEffect(() => {
    setCertificates(getStoredCertificates());
    setIsLoaded(true);

    const handleStorageChange = () => {
      setCertificates(getStoredCertificates());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCertificateUpdate = (updatedCerts: Certificate[]) => {
    setCertificates(updatedCerts);
    saveCertificates(updatedCerts);
  };

  const handleStudentSearch = () => {
    const student = findUserByRoll(searchRoll.trim());
    setFoundStudent(student);
  };

  const studentResults = useMemo(() => {
    if (!foundStudent) return null;
    const studentCerts = certificates.filter(c => 
      c.studentRollNumber?.trim().toUpperCase() === foundStudent.rollNumber?.toUpperCase()
    );
    return calculatePDCScore(studentCerts, DEFAULT_CATEGORY_RULES, foundStudent);
  }, [certificates, foundStudent]);

  if (!isLoaded) return null;

  const stats = [
    { label: 'Registered Students', value: getStoredUsers().length.toString(), icon: Users, color: 'text-blue-400' },
    { label: 'Pending Approvals', value: certificates.filter(c => c.status === 'pending').length, icon: AlertCircle, color: 'text-amber-400' },
    { label: 'Approved Total', value: certificates.filter(c => c.status === 'approved').length, icon: FileCheck, color: 'text-emerald-400' },
    { label: 'Rules Active', value: DEFAULT_CATEGORY_RULES.length, icon: Settings2, color: 'text-primary' },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background font-body overflow-hidden">
        <DashboardSidebar 
          role="admin" 
          userName={MOCK_ADMIN.name} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={() => window.location.href = '/'}
        />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <header>
              <h1 className="text-4xl font-black font-headline tracking-tight">Admin Console</h1>
              <p className="text-muted-foreground mt-1 text-lg">Oversee PDC evaluation and certification flows</p>
            </header>

            {activeTab === 'admin-dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <Card key={i} className="border-border hover:border-primary/50 transition-colors shadow-sm bg-card/40 backdrop-blur-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
                      </div>
                      <stat.icon className={`h-10 w-10 ${stat.color} opacity-80`} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {(activeTab === 'admin-dashboard' || activeTab === 'approvals') && (
              <AdminApprovalPanel certificates={certificates} rules={DEFAULT_CATEGORY_RULES} onUpdate={handleCertificateUpdate} />
            )}

            {activeTab === 'activity-hub' && (
              <ActivityHub role="admin" rules={DEFAULT_CATEGORY_RULES} />
            )}

            {activeTab === 'search' && (
              <div className="space-y-8">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" /> Student Credit Lookup
                    </CardTitle>
                    <CardDescription>Enter a student roll number (e.g., 0901CS231129) to view their profile.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search Roll Number..." 
                          className="pl-10" 
                          value={searchRoll}
                          onChange={(e) => setSearchRoll(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleStudentSearch()}
                        />
                      </div>
                      <Button onClick={handleStudentSearch} className="font-bold">Fetch Profile</Button>
                    </div>
                  </CardContent>
                </Card>

                {foundStudent && studentResults ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="lg:col-span-1">
                      <PDCScoreCard results={studentResults} />
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                      <Card className="border-border">
                        <CardHeader className="bg-secondary/20">
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-accent" /> Student Identity
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Full Name</p>
                            <p className="text-xl font-black">{foundStudent.name}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Roll Number</p>
                            <p className="text-xl font-black">{foundStudent.rollNumber}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email Address</p>
                            <p className="font-medium">{foundStudent.email}</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-border">
                        <CardHeader className="bg-secondary/20">
                          <CardTitle className="flex items-center gap-2 text-primary">
                            <Award className="h-5 w-5" /> Verified Extra Activities
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            {certificates
                              .filter(c => 
                                c.studentRollNumber?.trim().toUpperCase() === foundStudent.rollNumber?.toUpperCase() && 
                                c.status === 'approved'
                              )
                              .map(cert => (
                                <div key={cert.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-secondary/10">
                                  <div>
                                    <p className="font-bold text-sm">{cert.title}</p>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{cert.category}</p>
                                  </div>
                                  <div className="text-primary font-black">+{cert.creditPoints}</div>
                                </div>
                              ))
                            }
                            {certificates.filter(c => 
                              c.studentRollNumber?.trim().toUpperCase() === foundStudent.rollNumber?.toUpperCase() && 
                              c.status === 'approved'
                            ).length === 0 && (
                              <p className="text-center py-4 text-muted-foreground text-sm italic">No approved certificates found for this student.</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : searchRoll && (
                  <div className="text-center py-20 bg-secondary/20 rounded-2xl border-2 border-dashed border-border">
                    <p className="text-muted-foreground font-medium">No student record found for "<span className="font-bold text-foreground">{searchRoll}</span>"</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="grid gap-8">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>PDC Scoring Rules</CardTitle>
                    <CardDescription>Configure category limits and weightages for Semester VIII</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {DEFAULT_CATEGORY_RULES.map((rule) => (
                        <div key={rule.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-border bg-secondary/20 items-center">
                          <div className="flex-1">
                            <p className="font-bold text-lg">{rule.categoryName}</p>
                            <p className="text-xs text-muted-foreground">Internal Category ID: {rule.id}</p>
                          </div>
                          <div className="flex gap-6 items-center">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Max Credits</label>
                              <input type="number" defaultValue={rule.maxCredits} className="bg-background border border-border rounded px-2 py-1 w-20 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">Weightage</label>
                              <input type="number" step="0.1" defaultValue={rule.weightage} className="bg-background border border-border rounded px-2 py-1 w-20 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
