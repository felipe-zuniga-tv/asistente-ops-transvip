import { Card, CardContent, CardFooter, Skeleton } from "@/components/ui";

export default function Loading() {
    return (
        <div className="container max-w-2xl mx-auto p-4 sm:py-8">
            <Card>
                <CardContent className="pt-6">
                    <Skeleton className="h-2 w-full mb-4" />
                    <div className="flex justify-center mb-4">
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-3/4 mx-auto" />
                            <Skeleton className="h-4 w-2/3 mx-auto" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-gray-200 rounded-b-lg p-0">
                    <div className="w-full flex items-center justify-center text-sm text-black p-3">
                        <Skeleton className="h-4 w-32" />
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}