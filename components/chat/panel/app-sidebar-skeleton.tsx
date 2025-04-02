import { 
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenuSkeleton
} from "@/components/ui"

export default function AppSidebarSkeleton() {
    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Transvip</SidebarGroupLabel>
                <SidebarGroupContent>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <SidebarMenuSkeleton key={i} showIcon />
                    ))}
                </SidebarGroupContent>
            </SidebarGroup>

            {/* Other Sections Skeleton */}
            <SidebarGroup className="hidden">
                <SidebarGroupLabel>Operaciones Transvip</SidebarGroupLabel>
                <SidebarGroupContent>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SidebarMenuSkeleton key={i} showIcon />
                    ))}
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    )
}