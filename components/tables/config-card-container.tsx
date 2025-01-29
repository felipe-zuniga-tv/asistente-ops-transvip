import { AddButton } from "../ui/buttons"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { CardTitleContent } from "../ui/card-title-content"

export const ConfigCardContainer = ({ children, title, onAdd }: { children: React.ReactNode, title: string, onAdd: () => void }) => {
    return (
        <Card className="max-w-4xl mx-2 lg:mx-auto">
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                    <CardTitleContent title={title} />
                    <AddButton onClick={onAdd} />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
        </Card>
    )
}