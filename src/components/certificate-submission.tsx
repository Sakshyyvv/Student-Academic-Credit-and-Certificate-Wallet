
"use client"

import { useState, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, CheckCircle2, FileText, XCircle, FileIcon, Info } from "lucide-react";
import { CategoryRule } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CertificateSubmissionProps {
  rules: CategoryRule[];
  onSuccess?: (newCert: { title: string; category: string; fileUrl: string }) => void;
}

export function CertificateSubmission({ rules, onSuccess }: CertificateSubmissionProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectedCategoryRule = useMemo(() => {
    return rules.find(r => r.categoryName === category);
  }, [category, rules]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !selectedFile) return;
    
    setIsSubmitting(true);
    
    // Convert file to Base64 to persist in localStorage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      // Simulate API call delay
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(true);
        toast({
          title: "Certificate Submitted",
          description: "Your certificate is now pending admin approval.",
        });
        
        if (onSuccess) {
          onSuccess({ title, category, fileUrl: base64String });
        }

        // Reset form
        setTimeout(() => {
          setSuccess(false);
          setTitle('');
          setCategory('');
          setSelectedFile(null);
        }, 1500);
      }, 1000);
    };
    
    reader.onerror = () => {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Could not process the file. Please try again.",
      });
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Submit Certificate
        </CardTitle>
        <CardDescription>Upload your achievements for credit evaluation</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Activity Title</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AWS Cloud Practitioner" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} value={category} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {rules.map((rule) => (
                  <SelectItem key={rule.id} value={rule.categoryName}>
                    {rule.categoryName} (Max: {rule.maxCredits})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCategoryRule && (
              <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10 flex gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Performance Factors / Indicators</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedCategoryRule.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Certificate Document</Label>
            <div 
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "group border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative min-h-[160px]",
                isDragging ? "border-primary bg-primary/5" : "border-border bg-secondary/20 hover:bg-secondary/40",
                selectedFile && "border-emerald-500/50 bg-emerald-50/50"
              )}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center text-center">
                  <div className="bg-emerald-100 p-3 rounded-full mb-3">
                    <FileIcon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="font-bold text-sm text-foreground mb-1 max-w-[240px] truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={clearFile}
                    type="button"
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <>
                  <FileText className="h-10 w-10 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                  <p className="text-sm font-medium text-foreground">Click or drag PDF/Image to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">Maximum file size: 5MB</p>
                </>
              )}
              <input 
                ref={fileInputRef}
                id="file" 
                type="file" 
                className="hidden" 
                accept=".pdf,image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full h-11 text-lg font-bold" 
            disabled={isSubmitting || success || !title || !category || !selectedFile}
          >
            {isSubmitting ? "Processing..." : success ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Submitted
              </span>
            ) : "Submit for Approval"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
