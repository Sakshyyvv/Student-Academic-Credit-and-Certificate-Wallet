"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CampusActivity, CategoryRule, Role } from '@/lib/types';
import { getStoredActivities, saveActivities } from '@/lib/mock-data';
import { Megaphone, Plus, Calendar, ExternalLink, Trash2, Clock, MapPin, Tag } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function ActivityHub({ role, rules }: { role: Role, rules: CategoryRule[] }) {
  const { toast } = useToast();
  const [activities, setActivities] = useState<CampusActivity[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<CampusActivity>>({
    type: 'Seminar',
    category: rules[0]?.categoryName || ''
  });

  useEffect(() => {
    setActivities(getStoredActivities());
    
    const handleStorage = () => setActivities(getStoredActivities());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.title || !newActivity.description || !newActivity.link || !newActivity.registrationDeadline) return;

    const activity: CampusActivity = {
      id: `act-${Date.now()}`,
      title: newActivity.title,
      description: newActivity.description,
      type: newActivity.type as any,
      category: newActivity.category || '',
      link: newActivity.link,
      registrationDeadline: newActivity.registrationDeadline,
      postedDate: new Date().toISOString().split('T')[0],
    };

    const updated = [activity, ...activities];
    setActivities(updated);
    saveActivities(updated);
    setShowAddForm(false);
    setNewActivity({ type: 'Seminar', category: rules[0]?.categoryName });

    toast({
      title: "Activity Posted",
      description: "The activity is now live for all students.",
    });
  };

  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter(a => a.id !== id);
    setActivities(updated);
    saveActivities(updated);
    toast({
      title: "Activity Removed",
      description: "The post has been deleted.",
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black font-headline">Campus Activity Hub</h2>
          <p className="text-muted-foreground">Stay updated with ongoing seminars, hackathons, and certifications</p>
        </div>
        {role === 'admin' && (
          <Button className="font-bold gap-2" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : <><Plus className="h-4 w-4" /> Post Activity</>}
          </Button>
        )}
      </header>

      {showAddForm && role === 'admin' && (
        <Card className="border-primary/30 animate-in fade-in slide-in-from-top-4 duration-500">
          <CardHeader>
            <CardTitle>Post New Campus Opportunity</CardTitle>
            <CardDescription>Fill in the details to notify students about a new event.</CardDescription>
          </CardHeader>
          <form onSubmit={handleAddActivity}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Activity Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. MITS National Hackathon" 
                  value={newActivity.title || ''}
                  onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Opportunity Type</Label>
                <Select 
                  value={newActivity.type} 
                  onValueChange={(val) => setNewActivity({...newActivity, type: val as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Hackathon">Hackathon</SelectItem>
                    <SelectItem value="Course">Certification Course</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-full space-y-2">
                <Label htmlFor="desc">Detailed Description</Label>
                <Textarea 
                  id="desc" 
                  placeholder="Describe the activity and benefits..." 
                  value={newActivity.description || ''}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">PDC Category (For Credits)</Label>
                <Select 
                  value={newActivity.category} 
                  onValueChange={(val) => setNewActivity({...newActivity, category: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {rules.map(r => (
                      <SelectItem key={r.id} value={r.categoryName}>{r.categoryName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Registration Deadline</Label>
                <Input 
                  id="deadline" 
                  type="date" 
                  value={newActivity.registrationDeadline || ''}
                  onChange={(e) => setNewActivity({...newActivity, registrationDeadline: e.target.value})}
                  required
                />
              </div>
              <div className="col-span-full space-y-2">
                <Label htmlFor="link">Registration URL</Label>
                <Input 
                  id="link" 
                  placeholder="https://mits.edu/register-here" 
                  value={newActivity.link || ''}
                  onChange={(e) => setNewActivity({...newActivity, link: e.target.value})}
                  required
                />
              </div>
            </CardContent>
            <CardContent className="pt-0">
              <Button type="submit" className="w-full font-bold h-11">Broadcast to Students</Button>
            </CardContent>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activities.map((activity) => (
          <Card key={activity.id} className="group border-border hover:border-primary/50 transition-all shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      activity.type === 'Hackathon' ? 'bg-accent' : 
                      activity.type === 'Internship' ? 'bg-emerald-500' : 'bg-primary'
                    )}>
                      {activity.type}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Posted {activity.postedDate}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-black group-hover:text-primary transition-colors">
                    {activity.title}
                  </CardTitle>
                </div>
                {role === 'admin' && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() => handleDeleteActivity(activity.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <Tag className="h-3 w-3 text-primary" />
                  {activity.category.split('(')[0]}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-destructive">
                  <Calendar className="h-3 w-3" />
                  Until {activity.registrationDeadline}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-between items-center">
                <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> MITS Gwalior
                </div>
                <Button variant="outline" size="sm" className="font-bold gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all" asChild>
                  <a href={activity.link} target="_blank" rel="noopener noreferrer">
                    Join Now <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {activities.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-2xl bg-secondary/10">
            <Megaphone className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-4" />
            <p className="font-bold text-muted-foreground">No active campus notifications</p>
            <p className="text-xs text-muted-foreground/60">Check back later for new seminars and hackathons.</p>
          </div>
        )}
      </div>
    </div>
  );
}
