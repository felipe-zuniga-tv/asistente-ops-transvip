import { FileWithPreview } from "@/app/(finance)/finanzas/tickets/page";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { X, PlusCircle, Upload } from "lucide-react";
import Image from "next/image";

export default function TicketCards({ files, handleRemoveFile, handleClearFiles, handleUpload, onFileInputClick, isUploading }: {
    files: FileWithPreview[]
    handleRemoveFile: (indexToRemove: number) => void
    handleClearFiles: () => void
    handleUpload: () => Promise<void>
    onFileInputClick: () => void
    isUploading: boolean
}) {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-start items-center">
                        <div className="flex flex-row items-center gap-2">
                            <span>Archivos</span>
                            { files.length > 0 &&
                            <>
                                <span>·</span>
                                <span className="text-muted-foreground text-sm">{files.length} archivo{files.length > 1 ? 's' : ''}</span>
                            </>}
                        </div>
                        <Button disabled={files.length === 0} onClick={handleClearFiles} className="ml-auto">
                            <span className="text-sm">Vaciar lista</span>
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {files.length === 0 ? (
                        <div className="flex flex-col items-center gap-4">
                            <p>No se ha subido ninguna imagen.</p>
                        </div>
                    ) : (
                        <div className={`grid grid-cols-1 md:grid-cols-${files.length > 1 ? 2 : 1} gap-4 max-h-[450px] overflow-y-auto`}>
                            {files.map((file, index) => (
                                <div key={index} className="bg-slate-200 p-3 rounded-md relative group flex flex-col items-center justify-between gap-2">
                                    <div className="flex flex-row justify-between w-full px-2">
                                        <span className="font-semibold text-sm">Archivo #{index + 1}</span>
                                        <Button variant="ghost" size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <X className="rounded-full p-0.5 h-6 w-6 bg-red-500 text-white" />
                                        </Button>
                                    </div>
                                    <div className="h-px w-full bg-white"></div>
                                    <div className="flex flex-row gap-2 items-center justify-between w-full">
                                        <span className="text-xs mt-1 max-w-[80%] truncate">{file.name}</span>
                                        <div className="aspect-square rounded-lg overflow-hidden border bg-muted justify-end">
                                            <Image
                                                src={file.preview || ''}
                                                alt={file.name}
                                                width={300}
                                                height={300}
                                                className="h-auto w-[100px] object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={onFileInputClick} className="flex items-center gap-2">
                        <PlusCircle />
                        <span className="text-sm">Subir boleta</span>
                    </Button>
                </CardFooter>
            </Card>

            {files.length > 0 && (
                <div className="flex justify-center">
                    <Button onClick={handleUpload} disabled={isUploading} className="flex items-center gap-2">
                        <Upload size={16} />
                        {isUploading ? 'Procesando...' : 'Procesar'}
                    </Button>
                </div>
            )}
        </>
    )
}