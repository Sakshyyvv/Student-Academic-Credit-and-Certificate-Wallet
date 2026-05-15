"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PDCResults } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Award, Zap, GraduationCap, Plus } from "lucide-react";

export function PDCScoreCard({ results }: { results: PDCResults }) {
  const extraPercentage = (results.pdcScore / results.maxPossiblePdcScore) * 100;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card to-background border-primary/20 shadow-xl">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Award className="h-32 w-32" />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl font-bold font-headline">Credit Wallet</CardTitle>
            <CardDescription className="text-muted-foreground">Comprehensive Credit Summary</CardDescription>
          </div>
          <Badge variant="outline" className="border-accent text-accent bg-accent/10 px-3 py-1">
            MITS Official
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="flex flex-col items-center text-center">
            <div className="text-7xl font-black text-primary animate-in fade-in zoom-in duration-500 leading-none">
              {results.totalCombinedScore}
            </div>
            <div className="mt-4 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">
              Total Credits
            </div>
          </div>
          
          <div className="mt-10 flex items-center gap-6 text-sm font-medium">
             <div className="flex flex-col items-center">
               <span className="text-muted-foreground text-[10px] uppercase font-bold mb-1">Academic</span>
               <span className="text-xl font-bold text-foreground flex items-center gap-1">
                 <GraduationCap className="h-4 w-4 text-blue-500" /> {results.academicCredits}
               </span>
             </div>
             <Plus className="h-4 w-4 text-muted-foreground" />
             <div className="flex flex-col items-center">
               <span className="text-muted-foreground text-[10px] uppercase font-bold mb-1">Extra (PDC)</span>
               <span className="text-xl font-bold text-primary flex items-center gap-1">
                 <Award className="h-4 w-4 text-primary" /> {results.pdcScore}
               </span>
             </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>Extra Credits Progress (Max: {results.maxPossiblePdcScore})</span>
            <span className="text-primary">{Math.round(extraPercentage)}%</span>
          </div>
          <Progress value={extraPercentage} className="h-2.5 bg-secondary overflow-hidden">
            <div className="h-full bg-primary transition-all duration-700" style={{ width: `${extraPercentage}%` }} />
          </Progress>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-secondary/30 border border-border/50">
            <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest font-black">Total Extra</div>
            <div className="text-xl font-black flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              {results.totalExtraCredits}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-secondary/30 border border-border/50">
            <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest font-black">PDC Categories</div>
            <div className="text-xl font-black">{Object.keys(results.categoryCredits).length} / 6</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
