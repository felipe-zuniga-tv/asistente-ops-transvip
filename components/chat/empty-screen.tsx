import { TransvipLogo } from "@/components/transvip/transvip-logo";
import { toolsList } from "@/lib/core/config/tools";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/ui";

export function EmptyScreen({ session }: { session: any }) {
    const handleSelect = (value: string) => {
        const tool = toolsList.find(t => t.title === value);
        if (tool?.search) {
            const textarea = document.querySelector('textarea');
            if (textarea) {
                textarea.value = tool.search + ' ';
                // Trigger input event to update internal state
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                
                textarea.focus();
            }
        }
    };

    // Group tools by their general functionality
    const toolGroups = {
        "Reservas": toolsList.filter(t => 
            t.title.toLowerCase().includes('reserva') || 
            t.title.toLowerCase().includes('paquete')
        ),
        "Conductores": toolsList.filter(t => 
            t.title.toLowerCase().includes('conductor')
        ),
        "Aeropuerto": toolsList.filter(t => t.title.toLowerCase().includes('zona iluminada')),
        "Vehículos": toolsList.filter(t => 
            t.title.toLowerCase().includes('móvil') || 
            t.title.toLowerCase().includes('vehículo')
        ),
        "Otros": toolsList.filter(t => 
            !t.title.toLowerCase().includes('zona iluminada') &&
            !t.title.toLowerCase().includes('móvil') &&
            !t.title.toLowerCase().includes('vehículo') &&
            !t.title.toLowerCase().includes('reserva') &&
            !t.title.toLowerCase().includes('paquete') &&
            !t.title.toLowerCase().includes('conductor')
        )
    };

    return (
        <div className="messages-list">
            <div className="chat-message assistant">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-1">
                        <span className="font-semibold">¡Hola, {session.user.fullName}!</span>
                        <span className="font-normal">Soy Jarvip, tu asistente.</span>
                    </div>
                    <span className="font-bold">¿Con qué puedo ayudarte hoy?</span>
                    
                    <div className="w-full max-w-4xl">
                        <Tabs defaultValue="Reservas" className="w-full">
                            <TabsList className="grid gap-1 w-full grid-cols-5 h-12">
                                {Object.keys(toolGroups).map((group) => (
                                    <TabsTrigger 
                                        key={group} 
                                        value={group}
                                        className="text-sm h-10 data-[state=active]:bg-transvip data-[state=active]:text-white"
                                    >
                                        {group}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            {Object.entries(toolGroups).map(([group, tools]) => (
                                <TabsContent key={group} value={group} className="mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {tools.map((tool) => (
                                            <Card key={tool.title}
                                                className={cn(
                                                    "cursor-pointer transition-all hover:bg-slate-50",
                                                    "border-2 hover:border-transvip"
                                                )}
                                                onClick={() => handleSelect(tool.title)}
                                            >
                                                <CardHeader>
                                                    <div className="flex items-center gap-2">
                                                        {tool.icon && (
                                                            <tool.icon className="h-5 w-5 text-transvip" />
                                                        )}
                                                        <CardTitle className="text-base">
                                                            {tool.title}
                                                        </CardTitle>
                                                    </div>
                                                    {tool.hint && (
                                                        <CardDescription className="text-sm">
                                                            {tool.hint}
                                                        </CardDescription>
                                                    )}
                                                </CardHeader>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </div>
                <div className="flex flex-row gap-2 justify-end items-center text-xs mt-4">
                    <TransvipLogo logoOnly={true} colored={false} size={20} />
                </div>
            </div>
        </div>
    )
}