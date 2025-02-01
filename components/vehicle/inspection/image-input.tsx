"use client";

import { useCallback, useState } from "react";
import { Camera, Image as ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import Image from "next/image";

interface ImageInputProps {
    value?: string;
    onChange: (value: string) => void;
    allowGallery?: boolean;
}

export function ImageInput({ value, onChange, allowGallery }: ImageInputProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCameraCapture = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement("video");
            const canvas = document.createElement("canvas");

            video.srcObject = stream;
            await video.play();

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext("2d");
            context?.drawImage(video, 0, 0);

            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());

            const imageData = canvas.toDataURL("image/jpeg");
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
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
                setIsLoading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error reading file:", error);
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
                <Camera className="mr-2 h-4 w-4" />
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
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Seleccionar de Galería
                    </Button>
                    <input
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