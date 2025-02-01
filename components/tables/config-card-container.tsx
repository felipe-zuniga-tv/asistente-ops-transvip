import { AddButton } from "../ui/buttons"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { CardTitleContent } from "../ui/card-title-content"

interface ConfigCardContainerProps {
    children: React.ReactNode;
    title: string;
    onAdd: () => void;
    headerContent?: React.ReactNode;
}

export const ConfigCardContainer = ({ children, title, onAdd, headerContent }: ConfigCardContainerProps) => {
    return (
        <Card className="max-w-4xl mx-2 lg:mx-auto">
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                    <div className="flex items-center justify-between w-full">
                        <CardTitleContent title={title} />
                        <div className="flex items-center gap-4">
                            {headerContent}
                            <AddButton onClick={onAdd} />
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