"use client"

import { useState, useEffect } from 'react';
import { recommendActivities, StudentActivityRecommendationsOutput } from '@/ai/flows/student-activity-recommendations-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ArrowRight, Lightbulb } from "lucide-react";
import { PDCResults, CategoryRule, User } from '@/lib/types';

interface AIRecommendationsProps {
  results: PDCResults;
  rules: CategoryRule[];
  user: User;
}

export function AIRecommendations({ results, rules, user }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<StudentActivityRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecs() {
      try {
        const data = await recommendActivities({
          currentCreditsByCategory: results.categoryCredits,
          categoryRules: rules.map(r => ({
            categoryName: r.categoryName,
            maxCredits: r.maxCredits,
            weightage: r.weightage
          })),
          studentInterests: user.interests
        });
        setRecommendations(data);
      } catch (error) {
        console.error("AI fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecs();
  }, [results, rules, user]);

  return (
    <Card className="border-primary/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            AI Smart Path
          </CardTitle>
          <CardDescription>Personalized suggestions to maximize your PDC score</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {recommendations?.recommendations.map((rec, idx) => (
              <div 
                key={idx} 
                className="group relative p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="w-fit text-[10px] border-primary/50 text-primary uppercase font-bold">
                      {rec.category}
                    </Badge>
                    <h4 className="font-bold text-lg group-hover:text-accent transition-colors">
                      {rec.activity}
                    </h4>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {rec.reason}
                </p>
                <div className="mt-4 flex items-center text-xs font-bold text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore Activity <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
