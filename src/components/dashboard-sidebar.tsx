"use client"

import * as React from "react"
import Image from "next/image"
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Award, 
  ShieldCheck, 
  BarChart3,
  UserCircle,
  GraduationCap,
  Search,
  Megaphone
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Role } from "@/lib/types"
import { PlaceHolderImages } from "@/lib/placeholder-images"

interface DashboardSidebarProps {
  role: Role;
  userName: string;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardSidebar({ role, userName, onLogout, activeTab, setActiveTab }: DashboardSidebarProps) {
  const logoData = PlaceHolderImages.find(img => img.id === 'app-logo');

  const menuItems = role === 'student' ? [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'certificates', label: 'My Certificates', icon: FileText },
    { id: 'activity-hub', label: 'Activity Hub', icon: Megaphone },
    { id: 'pdc-score', label: 'PDC Score', icon: BarChart3 },
    { id: 'recommendations', label: 'AI Suggestions', icon: Award },
  ] : [
    { id: 'admin-dashboard', label: 'Admin Panel', icon: ShieldCheck },
    { id: 'approvals', label: 'Verification Queue', icon: FileText },
    { id: 'activity-hub', label: 'Campus Feed', icon: Megaphone },
    { id: 'search', label: 'Student Lookup', icon: Search },
    { id: 'settings', label: 'PDC Rules', icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 relative">
            {logoData ? (
              <Image 
                src={logoData.imageUrl} 
                alt="SACC Logo" 
                fill 
                className="object-contain"
                data-ai-hint={logoData.imageHint}
              />
            ) : (
              <div className="h-full w-full bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary-foreground h-6 w-6" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter leading-none">
              <span className="text-accent">SACC</span>
              <br />
              <span className="text-primary">WALLET</span>
            </span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-2">MITS Gwalior</p>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton 
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full justify-start gap-3 py-6"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-3 mb-2 rounded-lg bg-secondary/50 border border-border/50">
          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20">
            <UserCircle className="text-accent h-5 w-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold truncate text-foreground">{userName}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{role}</span>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
