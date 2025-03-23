"use client"

import { Search, type LucideIcon } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Input } from "../ui/input"
import { SidebarItem } from "@/lib/core/config/chat-sidebar"
import { Tool } from "@/lib/core/types/chat"

interface GroupedNavMainProps {
  items: SidebarItem[];
  handleClick: (tool: any) => void;
  showSearch?: boolean;
  searchQuery?: string;
}

export function GroupedNavMain({ 
  items, 
  handleClick, 
  showSearch = true,
  searchQuery = "" 
}: GroupedNavMainProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  // Update local search when parent search changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Filter items based on search query
  const filteredItems = items.filter(item => {
    if (!localSearchQuery) return true;
    
    const isItemMatch = item.title.toLowerCase().includes(localSearchQuery.toLowerCase());
    const hasMatchingSubItems = item.items?.some(subItem => 
      subItem.title.toLowerCase().includes(localSearchQuery.toLowerCase())
    );
    
    return isItemMatch || hasMatchingSubItems;
  });

  return (
    <>
      {showSearch && (
        <div className="relative bg-white rounded-lg flex items-center m-2 mx-0">
          <Search className="text-gray-500 size-4 absolute left-2 top-1/2 transform -translate-y-1/2" />
          <Input 
            type="text"
            name="sidebar_search"
            placeholder="Busca tu herramienta..."
            value={localSearchQuery}
            className="p-3 pl-8 border border-blue-200"
            onChange={(e) => setLocalSearchQuery(e.target.value)}
          />
        </div>
      )}

      {filteredItems.map((group) => {
        // Only show groups that have matching items after filtering
        const visibleItems = group.items?.filter(item => 
          !localSearchQuery || item.title.toLowerCase().includes(localSearchQuery.toLowerCase())
        );
        
        if (!visibleItems || visibleItems.length === 0) return null;
        
        return (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={item.active} 
                      className={group.highlight ? "bg-transvip/20 hover:bg-transvip/30" : ""}
                    >
                      {item.url ? (
                        <Link href={item.url}>
                          <div className="flex items-center">
                            {item.icon && <item.icon className="mr-2 size-4" />}
                            <span>{item.title}</span>
                          </div>
                        </Link>
                      ) : (
                        <div onClick={() => handleClick(item)} className="cursor-pointer flex items-center">
                          {item.icon && <item.icon className="mr-2 size-4" />}
                          <span>{item.title}</span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
} 