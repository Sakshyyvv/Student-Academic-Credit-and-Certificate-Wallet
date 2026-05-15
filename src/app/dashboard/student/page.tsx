"use client"

import { useState, useEffect, useRef, useMemo } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { PDCScoreCard } from "@/components/pdc-score-card";
import { AIRecommendations } from "@/components/ai-recommendations";
import { CertificateSubmission } from "@/components/certificate-submission";
import { ActivityHub } from "@/components/activity-hub";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStoredCertificates, saveCertificates, findUserByEmail, getSessionEmail, logoutSession, MOCK_STUDENTS } from "@/lib/mock-data";
import { DEFAULT_CATEGORY_RULES, calculatePDCScore } from "@/lib/pdc-logic";
import { Toaster } from "@/components/ui/toaster";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Plus, FileText, ExternalLink, Clock, CheckCircle2, XCircle, Trash2, Undo2, FileIcon, GraduationCap, Award } from "lucide-react";
import { Certificate, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [student, setStudent] = useState<User | null>(null);
  
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sessionEmail = getSessionEmail();
    if (!sessionEmail) {
      router.push('/');
      return;
    }
    
    const foundStudent = findUserByEmail(sessionEmail) || MOCK_STUDENTS[0];
    setStudent(foundStudent);
    
    // Filter certificates for this specific student
    const allCerts = getStoredCertificates();
    const studentCerts = allCerts.filter(c => 
      c.studentRollNumber?.toUpperCase() === foundStudent.rollNumber?.toUpperCase()
    );
    
    setCertificates(studentCerts);
    setIsLoaded(true);
  }, [router]);

  useEffect(() => {
    const handleStorageChange = () => {
      if (!undoTimeoutRef.current && student) {
        const allCerts = getStoredCertificates();
        const studentCerts = allCerts.filter(c => 
          c.studentRollNumber?.toUpperCase() === student.rollNumber?.toUpperCase()
        );
        setCertificates(studentCerts);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [student]);

  const results = useMemo(() => {
    if (!student) return null;
    return calculatePDCScore(certificates, DEFAULT_CATEGORY_RULES, student);
  }, [certificates, student]);

  const chartData = useMemo(() => {
    if (!results) return [];
    return DEFAULT_CATEGORY_RULES.map(rule => ({
      name: rule.categoryName.split(' ')[0],
      earned: results.categoryCredits[rule.categoryName] || 0,
      max: rule.maxCredits
    }));
  }, [results]);

  const handleNewUpload = (newCert: { title: string; category: string; fileUrl: string }) => {
    if (!student) return;

    const cert: Certificate = {
      id: `c${Date.now()}`,
      studentId: student.id,
      studentRollNumber: student.rollNumber,
      studentName: student.name,
      title: newCert.title,
      category: newCert.category,
      creditPoints: 0,
      status: 'pending',
      uploadDate: new Date().toISOString().split('T')[0],
      fileUrl: newCert.fileUrl,
    };
    
    const allCerts = getStoredCertificates();
    const updated = [cert, ...allCerts];
    saveCertificates(updated);
    
    // UI Update
    setCertificates(updated.filter(c => c.studentRollNumber?.toUpperCase() === student.rollNumber?.toUpperCase()));
    setShowUpload(false);
  };

  const handleDeleteCertificate = (id: string) => {
    const certToDelete = certificates.find(c => c.id === id);
    if (!certToDelete || !student) return;

    const originalCerts = [...certificates];
    const allCerts = getStoredCertificates();
    const filteredAllCerts = allCerts.filter(c => c.id !== id);
    
    // Update local state for immediate feedback
    setCertificates(certificates.filter(c => c.id !== id));

    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }

    undoTimeoutRef.current = setTimeout(() => {
      saveCertificates(filteredAllCerts);
      undoTimeoutRef.current = null;
    }, 5000);

    toast({
      title: "Certificate removed",
      description: `"${certToDelete.title}" has been removed.`,
      action: (
        <ToastAction 
          altText="Undo deletion" 
          onClick={() => {
            if (undoTimeoutRef.current) {
              clearTimeout(undoTimeoutRef.current);
              undoTimeoutRef.current = null;
              setCertificates(originalCerts);
              toast({
                title: "Action Undone",
                description: "The certificate has been restored.",
              });
            }
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
        >
          <Undo2 className="h-4 w-4" /> Undo
        </ToastAction>
      ),
    });
  };

  const handleLogout = () => {
    logoutSession();
    router.push('/');
  };

  if (!isLoaded || !student || !results) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background font-body overflow-hidden">
        <DashboardSidebar 
          role="student" 
          userName={student.name} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black font-headline tracking-tight text-foreground">Student Workspace</h1>
                <p className="text-muted-foreground mt-1 text-lg">Manage your academic credits and certificates</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-1">Roll Number</p>
                <Badge variant="outline" className="text-primary border-primary/30 text-sm py-1 px-3 font-bold">{student.rollNumber}</Badge>
              </div>
            </header>

            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                  <PDCScoreCard results={results} />
                  <CertificateSubmission rules={DEFAULT_CATEGORY_RULES} onSuccess={handleNewUpload} />
                </div>
                
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-blue-500" /> Academic Credits
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-black">{results.academicCredits}</div>
                        <p className="text-xs text-muted-foreground mt-1">Earned through regular coursework</p>
                      </CardContent>
                    </Card>
                    <Card className="border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" /> Extra PDC Points
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-black">{results.pdcScore}</div>
                        <p className="text-xs text-muted-foreground mt-1">Earned through extracurricular activities</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-border overflow-hidden">
                    <CardHeader className="bg-secondary/20">
                      <CardTitle className="text-xl">PDC Category Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                            />
                            <Tooltip 
                              cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4 }}
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Bar dataKey="earned" name="Earned Credits" radius={[4, 4, 0, 0]}>
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--accent))'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black">Digital Wallet</h2>
                    <p className="text-muted-foreground">Store and track all your earned certificates</p>
                  </div>
                  <Button className="font-bold gap-2" onClick={() => setShowUpload(!showUpload)}>
                    {showUpload ? <XCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {showUpload ? "Cancel Upload" : "Add New Certificate"}
                  </Button>
                </div>

                {showUpload && (
                  <div className="max-w-2xl mx-auto">
                    <CertificateSubmission rules={DEFAULT_CATEGORY_RULES} onSuccess={handleNewUpload} />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((cert) => (
                    <Card key={cert.id} className="border-border overflow-hidden group hover:border-primary/50 transition-all shadow-sm bg-card hover:shadow-md">
                      <div className="aspect-video relative overflow-hidden bg-muted flex items-center justify-center">
                        {cert.fileUrl.startsWith('data:application/pdf') ? (
                          <div className="flex flex-col items-center gap-2">
                            <FileIcon className="h-12 w-12 text-muted-foreground" />
                            <span className="text-xs font-bold uppercase text-muted-foreground">PDF Document</span>
                          </div>
                        ) : (
                          <img 
                            src={cert.fileUrl} 
                            alt={cert.title} 
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteCertificate(cert.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Badge className={
                            cert.status === 'approved' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                            cert.status === 'rejected' ? 'bg-destructive' : 'bg-amber-500 hover:bg-amber-600'
                          }>
                            {cert.status}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg line-clamp-1">{cert.title}</h3>
                            <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{cert.category}</p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {cert.uploadDate}
                          </div>
                          {cert.status === 'approved' && (
                            <div className="flex items-center gap-1 text-emerald-600 font-bold">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>+{cert.creditPoints} Pts</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {certificates.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4">
                      <div className="bg-secondary/20 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                        <FileText className="h-10 w-10 text-muted-foreground opacity-30" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-bold">No certificates yet</p>
                        <p className="text-muted-foreground">Upload your first achievement to start earning PDC credits.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'activity-hub' && (
              <ActivityHub role="student" rules={DEFAULT_CATEGORY_RULES} />
            )}

            {activeTab === 'recommendations' && (
              <AIRecommendations results={results} rules={DEFAULT_CATEGORY_RULES} user={student} />
            )}

            {activeTab === 'pdc-score' && (
              <div className="max-w-4xl mx-auto space-y-8">
                 <PDCScoreCard results={results} />
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-blue-500" /> Academic Breakdown
                        </CardTitle>
                        <CardDescription>Credits earned per semester</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Semester</TableHead>
                              <TableHead className="text-right">Credits</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {student.semesterAcademicCredits?.map((sem, i) => (
                              <TableRow key={i}>
                                <TableCell className="font-medium">{sem.semester}</TableCell>
                                <TableCell className="text-right font-bold">{sem.credits}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="bg-secondary/30 font-black">
                              <TableCell>Total Academic</TableCell>
                              <TableCell className="text-right">{results.academicCredits}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                   </Card>

                   <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" /> PDC Breakdown
                        </CardTitle>
                        <CardDescription>Extra credits by category</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {DEFAULT_CATEGORY_RULES.map(rule => {
                          const earned = results.categoryCredits[rule.categoryName] || 0;
                          const effective = Math.min(earned, rule.maxCredits);
                          return (
                            <div key={rule.id} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-2">
                              <div className="flex justify-between font-bold text-xs">
                                <span>{rule.categoryName}</span>
                                <span className="text-primary">{effective} / {rule.maxCredits}</span>
                              </div>
                              <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary" 
                                  style={{ width: `${(effective / rule.maxCredits) * 100}%` }} 
                                />
                              </div>
                            </div>
                          )
                        })}
                      </CardContent>
                   </Card>
                 </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
