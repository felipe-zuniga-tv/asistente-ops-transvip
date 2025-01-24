import { TransvipLogo } from "../transvip/transvip-logo";
import { toolsList } from "@/lib/config/tools";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
        "Aeropuerto": toolsList.filter(t => t.title.toLowerCase().includes('zona iluminada')),
        "Vehículos": toolsList.filter(t => 
            t.title.toLowerCase().includes('móvil') || 
            t.title.toLowerCase().includes('vehículo')
        ),
        "Reservas": toolsList.filter(t => 
            t.title.toLowerCase().includes('reserva') || 
            t.title.toLowerCase().includes('paquete')
        ),
        "Conductores": toolsList.filter(t => 
            t.title.toLowerCase().includes('conductor')
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
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-1">
                        <span className="font-semibold">¡Hola, {session.user.full_name}!</span>
                        <span className="font-normal">Soy Jarvip, tu asistente.</span>
                    </div>
                    <span className="font-bold">¿Con qué puedo ayudarte hoy?</span>
                    
                    <div className="mt-4 max-w-sm">
                        <Select onValueChange={handleSelect}>
                            <SelectTrigger className="w-full bg-white text-black h-12">
                                <SelectValue placeholder="Selecciona una consulta..." />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(toolGroups).map(([group, tools]) => tools.length > 0 && (
                                    <SelectGroup key={group}>
                                        <SelectLabel className="text-slate-700 bg-slate-100 rounded-md">{group}</SelectLabel>
                                        {tools.map((tool) => (
                                            <SelectItem 
                                                key={tool.title} 
                                                value={tool.title}
                                                className="flex flex-row items-center gap-2"
                                            >
                                                <div className="flex flex-row items-center gap-2">
                                                    {tool.icon && <tool.icon className="h-4 w-4 mr-2 text-transvip" />}
                                                    <div className="flex flex-col items-start">
                                                        <span>{tool.title}</span>
                                                        {tool.hint && (
                                                            <span className="text-xs text-muted-foreground">{tool.hint}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-row gap-2 justify-end items-center text-xs">
                    <TransvipLogo logoOnly={true} colored={false} size={20} />
                </div>
            </div>
        </div>
    )
}