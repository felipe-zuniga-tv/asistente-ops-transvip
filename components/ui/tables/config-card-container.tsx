import { cn } from '@/utils/ui';
import { AddButton } from "../ui/buttons"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { CardTitleContent } from "../ui/card-title-content"

interface ConfigCardContainerProps {
    children: React.ReactNode;
    title: string;
    onAdd?: () => void;
    headerContent?: React.ReactNode;
    className?: string;
}

export const ConfigCardContainer = ({ children, title, onAdd, headerContent, className = "" }: ConfigCardContainerProps) => {
    return (
        <Card className={cn("max-w-4xl mx-2 lg:mx-auto", className)}>
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
                        <CardTitleContent title={title} />
                        <div className="flex items-center gap-4">
                            {headerContent}
                            {onAdd && <AddButton onClick={onAdd} />}
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
        </Card>
    )
}