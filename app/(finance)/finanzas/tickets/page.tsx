'use client'

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardDescription,
    CardFooter,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { TransvipLogo } from "@/components/transvip/transvip-logo";
import TicketCards from "@/components/finance/tickets/ticket-cards";
import TicketResults from "@/components/finance/tickets/ticket-results";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";

export interface FileWithPreview extends File {
    preview?: string;
}

export interface TicketResultType {
    booking_id: number
    nro_boleta: string
    date_issued: string
    time_issued: string
    entry_date: string
    entry_time: string
    exit_date: string
    exit_time: string
    valor: number
}

export default function ParkingTickets() {
    const [files, setFiles] = useState<FileWithPreview[]>([]); // State to hold selected files
    const [results, setResults] = useState<TicketResultType[]>([]); // State to hold processing results
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

        if (files.length === 0) setResults([])
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);
        setResults([])
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
            const parsedResults = data.results.map((r: string) => JSON.parse(r));
            console.log(parsedResults)

            setResults(parsedResults);

        } catch (error) {
            console.error('Upload failed:', error);
            setResults([])
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileInputClick = () => {
        fileInputRef.current?.click();
    };

    const handleClearFiles = () => {
        setFiles([])
    };

    const handleClearResults = () => {
        setResults([]);
    };

    return (
        <MaxWidthWrapper>
            <Card>
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
                                handleClearFiles={handleClearFiles}
                                handleRemoveFile={handleRemoveFile}
                                handleUpload={handleUpload}
                                onFileInputClick={handleFileInputClick}
                                isUploading={isUploading}
                            />

                            {isUploading && <div className="w-full text-center">Cargando...</div>}
                            {!isUploading && <TicketResults results={results} handleClearResults={handleClearResults} />}
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
            </Card>
        </MaxWidthWrapper>
    );
}