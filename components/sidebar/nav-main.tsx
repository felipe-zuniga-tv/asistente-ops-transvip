"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Tool } from "@/lib/chat/types"

export function NavMain({ items, handleClick }: {
  items: {
    title: string
    url?: string
    href?: string
    icon?: LucideIcon
    isActive?: boolean
    items?: Tool[]
  }[]
  handleClick: any
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="hidden">Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        { subItem.url ? (
                          <Link href={subItem.url} aria-disabled={!subItem.active}>
                            { subItem.icon && <subItem.icon />}
                            <span>{subItem.title}</span>
                          </Link>
                        ) : (
                          <div onClick={() => handleClick(subItem)} className="cursor-pointer">
                            { subItem.icon && <subItem.icon />}
                            <span>{subItem.title}</span>
                          </div>
                        )}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
