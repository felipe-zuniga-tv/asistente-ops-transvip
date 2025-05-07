"use client"

import * as React from "react"
import { PlusCircle, Trash2, Users, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { sidebarData } from "@/lib/core/config/chat-sidebar"
import {
    addGroupMember,
    addSectionAccess,
    getEmailGroupMembers,
    getSectionAccess,
    removeGroupMember,
    removeSectionAccess,
} from "@/lib/features/access-control"
import { ConfigCardContainer } from "@/components/ui/tables/config-card-container"
import { CreateGroupDialog } from "./create-group-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EditGroupDialog } from "./edit-group-dialog"

interface AccessControlFormProps {
    initialGroups: {
        id: string
        name: string
        description?: string
        member_count: number
        members: Array<{
            id: string
            email: string
        }>
        access: Array<{
            id: string
            section_id: string
        }>
    }[]
}

export function AccessControlForm({ initialGroups }: AccessControlFormProps) {
    const [groups, setGroups] = React.useState(initialGroups)
    const [selectedGroup, setSelectedGroup] = React.useState<any>(null)
    const [members, setMembers] = React.useState<any[]>([])
    const [sectionAccess, setSectionAccess] = React.useState<any[]>([])
    const [newEmail, setNewEmail] = React.useState("")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
    const [groupToEdit, setGroupToEdit] = React.useState<any>(null)

    // Use pre-fetched data when selecting a group
    React.useEffect(() => {
        if (selectedGroup) {
            const group = groups.find(g => g.id === selectedGroup.id)
            if (group) {
                setMembers(group.members)
                setSectionAccess(group.access)
            }
        }
    }, [selectedGroup, groups])

    async function handleAddMember(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedGroup || !newEmail) return

        try {
            const member = await addGroupMember(selectedGroup.id, newEmail)
            setMembers([...members, member])
            setNewEmail("")
            toast.success("Miembro agregado exitosamente")
        } catch (error) {
            toast.error("Error al agregar el miembro")
        }
    }

    async function handleRemoveMember(memberId: string) {
        try {
            await removeGroupMember(memberId)
            setMembers(members.filter(m => m.id !== memberId))
            toast.success("Miembro eliminado exitosamente")
        } catch (error) {
            toast.error("Error al eliminar el miembro")
        }
    }

    async function handleToggleSectionAccess(sectionId: string) {
        if (!selectedGroup) return

        const existingAccess = sectionAccess.find(a => a.section_id === sectionId)

        try {
            if (existingAccess) {
                await removeSectionAccess(existingAccess.id)
                setSectionAccess(sectionAccess.filter(a => a.id !== existingAccess.id))
                toast.success("Acceso removido exitosamente")
            } else {
                const access = await addSectionAccess(selectedGroup.id, sectionId)
                setSectionAccess([...sectionAccess, access])
                toast.success("Acceso agregado exitosamente")
            }
        } catch (error) {
            toast.error("Error al modificar el acceso")
        }
    }

    // Get all available sections from sidebar data
    const availableSections = React.useMemo(() => {
        // Get sections from main navigation
        const mainSections = sidebarData.navMain.map(section => ({
            id: section.title.toLowerCase().replace(/\s+/g, ''),
            title: section.title,
            type: 'main'
        }))

        // Get sections from secondary navigation
        const secondarySections = sidebarData.navSecondary
            .filter(section => !section.external) // Only include non-external links
            .map(section => ({
                id: section.title.toLowerCase().replace(/\s+/g, ''),
                title: section.title,
                type: 'secondary'
            }))

        return [...mainSections, ...secondarySections]
    }, [])

    function handleGroupCreated(newGroup: any) {
        // Add empty arrays for members and access since it's a new group
        setGroups([...groups, { ...newGroup, member_count: 0, members: [], access: [] }])
    }

    function handleGroupUpdated(updatedGroup: any) {
        setGroups(groups.map(group => 
            group.id === updatedGroup.id 
                ? { ...group, ...updatedGroup }
                : group
        ))
    }

    return (
        <ConfigCardContainer 
            title="Administrar Grupos"
            onAdd={() => setIsCreateDialogOpen(true)}
            className="max-w-full w-full"
        >
            <div className="space-y-6">
                {/* Groups Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {groups.map(group => (
                        <div 
                            key={group.id}
                            className={`p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-colors ${
                                selectedGroup?.id === group.id ? "bg-muted border-primary" : ""
                            }`}
                        >
                            <div className="space-y-3">
                                <div className="flex flex-col space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">{group.name}</h3>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setGroupToEdit(group)
                                                setIsEditDialogOpen(true)
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{group.description}</p>
                                </div>
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>{group.member_count}</span>
                                    </div>
                                    <Button
                                        variant={selectedGroup?.id === group.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedGroup(selectedGroup?.id === group.id ? null : group)}
                                    >
                                        {selectedGroup?.id === group.id ? "Cerrar" : "Gestionar"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Group Detail */}
                {selectedGroup && (
                    <div className="grid gap-6">
                        {/* Section Access */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Secciones Habilitadas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Main Navigation Sections */}
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Navegación Principal</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                            {availableSections
                                                .filter(section => section.type === 'main')
                                                .map(section => (
                                                    <div key={section.id} className="flex items-center gap-2 p-2 rounded-md bg-muted text-sm shadow">
                                                        <input
                                                            type="checkbox"
                                                            id={section.id}
                                                            checked={sectionAccess.some(a => a.section_id === section.id)}
                                                            onChange={() => handleToggleSectionAccess(section.id)}
                                                            className="h-4 w-4 rounded border-gray-300"
                                                        />
                                                        <label htmlFor={section.id} className="flex-1">{section.title}</label>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Secondary Navigation Sections */}
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Navegación Secundaria</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                            {availableSections
                                                .filter(section => section.type === 'secondary')
                                                .map(section => (
                                                    <div key={section.id} className="flex items-center gap-2 p-2 rounded-md bg-muted text-sm shadow">
                                                        <input
                                                            type="checkbox"
                                                            id={section.id}
                                                            checked={sectionAccess.some(a => a.section_id === section.id)}
                                                            onChange={() => handleToggleSectionAccess(section.id)}
                                                            className="h-4 w-4 rounded border-gray-300"
                                                        />
                                                        <label htmlFor={section.id} className="flex-1">{section.title}</label>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Members Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>Miembros del Grupo</span>
                                    <span>·</span>
                                    {members.length > 0 && <span>{members.length} usuario{ members.length > 1 ? "s" : "" }</span>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handleAddMember} className="flex gap-2">
                                    <Input
                                        type="email"
                                        placeholder="Email del usuario"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="submit" variant={"default"} className="bg-transvip hover:bg-transvip/80">
                                        <PlusCircle className="h-4 w-4" />
                                        Agregar
                                    </Button>
                                </form>

                                <ScrollArea className="h-[300px] rounded-md border">
                                    <div className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {members.map(member => (
                                                <div 
                                                    key={member.id} 
                                                    className="flex flex-col space-y-2 p-3 rounded-md bg-muted shadow"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-normal text-sm pl-1">{member.email}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleRemoveMember(member.id)}
                                                            className="h-8 w-8"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            <CreateGroupDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onGroupCreated={handleGroupCreated}
            />

            <EditGroupDialog
                group={groupToEdit}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onGroupUpdated={handleGroupUpdated}
            />
        </ConfigCardContainer>
    )
} 