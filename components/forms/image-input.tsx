"use client";

import { useCallback, useState } from "react";
import { Camera, Image as ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface ImageInputProps {
    value?: string;
    onChange: (value: string) => void;
    allowGallery?: boolean;
}

export function ImageInput({ value, onChange, allowGallery }: ImageInputProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCameraCapture = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: {
                    facingMode: 'environment' // Prefer back camera
                }
            });
            
            const video = document.createElement("video");
            video.srcObject = stream;
            
            // Wait for video metadata to load
            await new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    video.play().then(resolve);
                };
            });

            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext("2d");
            if (!context) throw new Error("Could not get canvas context");
            
            context.drawImage(video, 0, 0);

            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());

            const imageData = canvas.toDataURL("image/jpeg", 0.8); // Compress to 80% quality
            onChange(imageData);
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    }, [onChange]);

    const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);

        try {
            // Compress image before converting to base64
            const compressedFile = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        let width = img.width;
                        let height = img.height;

                        // Max dimensions
                        const MAX_WIDTH = 1920;
                        const MAX_HEIGHT = 1080;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;

                        const ctx = canvas.getContext("2d");
                        if (!ctx) {
                            reject(new Error("Could not get canvas context"));
                            return;
                        }

                        ctx.drawImage(img, 0, 0, width, height);
                        resolve(canvas.toDataURL("image/jpeg", 0.8)); // Compress to 80% quality
                    };
                    img.onerror = reject;
                    img.src = e.target?.result as string;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            onChange(compressedFile);
        } catch (error) {
            console.error("Error reading file:", error);
        } finally {
            setIsLoading(false);
        }
    }, [onChange]);

    const handleClear = useCallback(() => {
        onChange("");
    }, [onChange]);

    if (value) {
        return (
            <Card className="relative">
                <CardContent className="p-2">
                    <div className="relative aspect-video w-full">
                        <Image
                            src={value}
                            alt="Captured image"
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-4 right-4"
                        onClick={handleClear}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleCameraCapture}
            >
                <Camera className="h-4 w-4 mr-2" />
                Tomar Foto
            </Button>

            {allowGallery && (
                <div className="relative">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={isLoading}
                    >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Seleccionar de Galería
                    </Button>
                    <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileSelect}
                        disabled={isLoading}
                    />
                </div>
            )}
        </div>
    );
} 