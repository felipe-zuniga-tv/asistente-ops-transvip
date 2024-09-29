'use client'

import { cn } from "@/lib/utils";
import { TransvipLogo } from "@/components/transvip/transvip-logo";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toolsList } from "@/lib/chat/config";
import { useActions, useUIState } from "ai/rsc"; // Import useUIState
import { nanoid } from "nanoid";
import { UserMessage } from "../message";

export default function SidebarOptions({ session, className = "" }) {
  const [_, setMessages] = useUIState(); // Initialize useUIState
  const { submitUserMessage } = useActions(); // Initialize submitUserMessage

  const handleToolClick = async (tool) => {
    const userMessageContent = `${tool.search}`.trim();
    
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <UserMessage content={userMessageContent} session={session} /> // Ensure session is passed if needed
      }
    ]);

    const response = await submitUserMessage(userMessageContent)
      setMessages((currentMessages) => [
          ...currentMessages,
          response
      ])
  };

  return (
    <aside className={cn("hidden inset-y fixed left-0 z-20 xs:flex h-full flex-col bg-transvip/70", className)}>
      <div className="mx-auto h-[56px] flex items-center">
        <TransvipLogo logoOnly={true} size={30} />
      </div>
      <div className="w-[52px]">
        <nav className="grid gap-1 p-2 lg:hidden">
          { toolsList.map((item) => (
            <Tooltip key={item.name}> {/* Added key for Tooltip */}
              <TooltipTrigger asChild>
                { item.href ? (
                  <Link href={item.href} onClick={() => handleToolClick(item)}> {/* Call handleToolClick */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg hover:bg-slate-700 text-transvip-dark hover:text-white border-0"
                      aria-label={item.name}
                    >
                      <item.icon className="size-5" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-lg hover:bg-slate-700 text-transvip-dark hover:text-white border-0"
                    aria-label={item.name}
                    onClick={() => handleToolClick(item)} // Call handleToolClick
                  >
                    <item.icon className="size-5" />
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <div className="flex flex-col gap-1">
                  <span>{ item.name }</span>
                  <p className="text-xs text-muted-foreground" data-description>{ item.hint }</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </div>
    </aside>
  )
}