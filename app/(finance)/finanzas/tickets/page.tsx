'use client'

import { useState, useEffect, useRef } from "react"; // Import useState for managing state and useEffect for cleanup
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { PlusCircle, Trash2, Upload, X } from "lucide-react";
// import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { TransvipLogo } from "@/components/transvip/transvip-logo";
import TicketCards from "@/components/finance/tickets/ticket-cards";

export interface FileWithPreview extends File {
    preview?: string;
}

export default function ParkingTickets() {
    const [files, setFiles] = useState<FileWithPreview[]>([]); // State to hold selected files
    const [results, setResults] = useState<string[]>([]); // State to hold processing results
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

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
        if (files.length === 0) return;
        
        setIsUploading(true);
        try {
            const formData = new FormData();
            // Append all files with the same field name
            files.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch("/api/image/parking", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }

            const data = await response.json();
            setResults(data.results);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileInputClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-4 p-2 md:p-0">
            <div className="mb-0">
                <CardHeader className="">
                    <CardTitle className="flex flex-col md:flex-row gap-2 justify-between items-center">
                        <div className="flex flex-row items-center gap-2">
                            <TransvipLogo colored={true} size={20} />
                            <span className="text-lg font-bold">Tickets Estacionamiento</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                        <TicketCards 
                            files={files} 
                            handleRemoveFile={handleRemoveFile} 
                            handleUpload={handleUpload}
                            onFileInputClick={handleFileInputClick}
                        />

                        {results.length > 0 && <Card className="mb-4">
                            <CardHeader>
                                <CardTitle>Resultados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                { isUploading ? 
                                    (<div>Cargando...</div>) : 
                                    (<ul>
                                        {results.map((result, index) => (
                                            <li key={index}>{result}</li>
                                        ))}
                                    </ul>)
                                }
                            </CardContent>
                        </Card>}
                    </div>
                </CardContent>
            </div>
            <Input 
                ref={fileInputRef}
                id="file-input" 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleFileChange} 
                className="hidden" 
            />
        </div>
    );
}