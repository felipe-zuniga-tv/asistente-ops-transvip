'use client'

import { useState, useEffect } from "react"; // Import useState for managing state and useEffect for cleanup
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Upload } from "lucide-react";
import { TransvipLogo } from "@/components/transvip/transvip-logo";
import Image from "next/image";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface FileWithPreview extends File {
    preview?: string;
}

export default function ParkingTickets() {
    const [files, setFiles] = useState<FileWithPreview[]>([]); // State to hold selected files
    const [results, setResults] = useState<string[]>([]); // State to hold processing results

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files).map(file => {
                const fileWithPreview = file as FileWithPreview;
                fileWithPreview.preview = URL.createObjectURL(file);
                return fileWithPreview;
            });
            setFiles((prevFiles) => [...prevFiles, ...newFiles]); // Append new files to existing files
        }
    };

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            files.forEach(file => {
                if (file.preview) URL.revokeObjectURL(file.preview);
            });
        };
    }, [files]);

    const handleRemoveFile = (indexToRemove: number) => {
        setFiles(prevFiles => {
            const fileToRemove = prevFiles[indexToRemove];
            if (fileToRemove.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return prevFiles.filter((_, index) => index !== indexToRemove);
        });
    };

    const handleUpload = async () => {
        if (files.length === 0) return; // Prevent upload if no files are selected

        const promises = files.map(async (file) => {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("/api/image/parking", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            return data.result; // Assuming the API returns a result field
        });

        const results = await Promise.all(promises);
        setResults(results); // Update results state with processed data
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-4 p-2 md:p-0">
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="flex flex-col md:flex-row gap-2 justify-between items-center">
                        <div className="flex flex-row items-center gap-2">
                            <TransvipLogo colored={true} size={20} />
                            <span className="text-lg font-bold">Tickets Estacionamiento</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Archivos</span>
                                    {files.length > 0 && <span className="text-muted-foreground text-sm">{files.length} archivos</span>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {files.length === 0 ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <p>No se ha subido ninguna imagen.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto">
                                        {files.map((file, index) => (
                                            <div key={index} className="bg-slate-200 p-2 rounded-md relative group flex items-center justify-between gap-2">
                                                <span className="font-bold text-sm p-1 rounded-full bg-slate-700 text-white w-[40px] text-center">{index + 1}</span>
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
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 ml-2"
                                                    onClick={() => handleRemoveFile(index)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-center">
                                <Button onClick={() => document.getElementById('file-input')?.click()} className="flex items-center gap-2">
                                    <PlusCircle />
                                    <span className="text-sm">Subir boleta</span>
                                </Button>
                            </CardFooter>
                        </Card>

                        {files.length > 0 && (
                            <div className="flex justify-center">
                                <Button onClick={handleUpload} className="flex items-center gap-2">
                                    <Upload size={16} />
                                    Procesar
                                </Button>
                            </div>
                        )}

                        {results.length > 0 && <Card className="mb-4">
                            <CardHeader>
                                <CardTitle>Resultados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul>
                                    {results.map((result, index) => (
                                        <li key={index}>{result}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>}
                    </div>
                </CardContent>
            </Card>
            <Input id="file-input" type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
        </div>
    );
}