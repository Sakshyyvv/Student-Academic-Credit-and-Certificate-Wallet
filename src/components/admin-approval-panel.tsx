"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Certificate, CategoryRule } from '@/lib/types';
import { Check, X, Eye, ShieldAlert, History, Clock, Search } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export function AdminApprovalPanel({ 
  certificates, 
  rules,
  onUpdate
}: { 
  certificates: Certificate[], 
  rules: CategoryRule[],
  onUpdate: (updated: Certificate[]) => void
}) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchRoll, setSearchRoll] = useState("");
  
  const filteredCertificates = useMemo(() => {
    if (!searchRoll.trim()) return certificates;
    return certificates.filter(c => 
      c.studentRollNumber?.toLowerCase().includes(searchRoll.toLowerCase())
    );
  }, [certificates, searchRoll]);

  const pending = filteredCertificates.filter(c => c.status === 'pending');
  const processed = filteredCertificates.filter(c => c.status !== 'pending');

  const handleAction = (id: string, action: 'approved' | 'rejected', points: number) => {
    const updated = certificates.map(c => 
      c.id === id ? { ...c, status: action, creditPoints: points } : c
    );
    
    onUpdate(updated);
    
    toast({
      title: action === 'approved' ? "Submission Approved" : "Submission Rejected",
      description: `Status changed to ${action}. Credits ${action === 'approved' ? `set to: ${points}` : 'cleared'}.`,
    });
  };

  const getPointsForCategory = (categoryName: string) => {
    const rule = rules.find(r => r.categoryName === categoryName);
    return rule?.pointsPerCertificate || 0;
  };

  const CertificateTable = ({ list, isHistory = false }: { list: Certificate[], isHistory?: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead>Roll No / Student</TableHead>
          <TableHead>Activity</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Doc</TableHead>
          {isHistory && <TableHead>Status</TableHead>}
          <TableHead className="w-[100px]">Credits</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list.map((cert) => {
          const autoPoints = getPointsForCategory(cert.category);
          
          return (
            <TableRow key={cert.id} className="border-border hover:bg-secondary/20 transition-colors">
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-primary">{cert.studentRollNumber || 'N/A'}</span>
                  <span className="text-[10px] text-muted-foreground">{cert.studentName || 'Shourya Dubey'}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm font-semibold">{cert.title}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[10px] uppercase">{cert.category}</Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </a>
                </Button>
              </TableCell>
              {isHistory && (
                <TableCell>
                  <Badge 
                    variant={cert.status === 'approved' ? 'default' : 'destructive'}
                    className="text-[10px] capitalize"
                  >
                    {cert.status}
                  </Badge>
                </TableCell>
              )}
              <TableCell>
                <Input 
                  type="number" 
                  defaultValue={cert.status === 'approved' ? cert.creditPoints : autoPoints} 
                  className="h-8 w-16 text-xs"
                  id={`pts-${cert.id}`}
                />
              </TableCell>
              <TableCell className="text-right space-x-2">
                {cert.status !== 'rejected' && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => handleAction(cert.id, 'rejected', 0)}
                    title="Reject"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
                {cert.status !== 'approved' && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-green-500 hover:bg-green-500/10"
                    onClick={() => {
                      const pts = parseInt((document.getElementById(`pts-${cert.id}`) as HTMLInputElement).value) || autoPoints;
                      handleAction(cert.id, 'approved', pts);
                    }}
                    title="Approve (Auto-calculated)"
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                )}
                {cert.status === 'approved' && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-blue-500 hover:bg-blue-500/10"
                    onClick={() => {
                      const pts = parseInt((document.getElementById(`pts-${cert.id}`) as HTMLInputElement).value) || autoPoints;
                      handleAction(cert.id, 'approved', pts);
                    }}
                    title="Update Credits"
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-black flex items-center gap-2 font-headline">
              <ShieldAlert className="h-6 w-6 text-primary" />
              Evaluation Workspace
            </CardTitle>
            <CardDescription>Verify student achievements and manage credit distribution</CardDescription>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Filter by Roll Number..." 
                  className="pl-10 h-9 w-full md:w-64"
                  value={searchRoll}
                  onChange={(e) => setSearchRoll(e.target.value)}
                />
             </div>
             <div className="flex gap-2 justify-end">
                <Badge variant="secondary" className="px-3 py-0.5 text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  {pending.length} Pending
                </Badge>
                <Badge variant="outline" className="px-3 py-0.5 text-[10px]">
                  {processed.length} Processed
                </Badge>
             </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-[400px] mb-6">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Queue
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" /> History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {pending.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold">No results found</p>
                  <p className="text-muted-foreground">Try a different roll number or check the history.</p>
                </div>
              </div>
            ) : (
              <CertificateTable list={pending} />
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {processed.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="bg-secondary/50 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                  <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold">No history matching search</p>
                  <p className="text-muted-foreground">Approve or reject submissions to see them here.</p>
                </div>
              </div>
            ) : (
              <CertificateTable list={processed} isHistory />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
