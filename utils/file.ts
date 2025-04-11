interface FileSystemFileHandle {
    createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream {
    write(data: Blob): Promise<void>;
    close(): Promise<void>;
}

interface ShowSaveFilePicker {
    (options: {
        suggestedName: string;
        types: Array<{
            description: string;
            accept: Record<string, string[]>;
        }>;
    }): Promise<FileSystemFileHandle>;
}

declare global {
    interface Window {
        showSaveFilePicker: ShowSaveFilePicker;
    }
}

/**
 * Downloads a file with the given content and filename.
 * Uses the modern File System Access API when available, with fallback to traditional method.
 * 
 * @param content - The content to be downloaded
 * @param filename - The name of the file to be downloaded
 * @param options - Optional configuration for the download
 * @returns Promise that resolves when the download is complete
 */
export async function downloadFile(
    content: string,
    filename: string,
    options: {
        mimeType?: string;
        onError?: (error: Error) => void;
    } = {}
): Promise<void> {
    const { mimeType = "text/csv;charset=utf-8", onError } = options

    try {
        const blob = new Blob([content], { type: mimeType })
        
        // Try to use modern File System Access API if available
        if ('showSaveFilePicker' in window) {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: filename,
                    types: [{
                        description: 'File',
                        accept: { [mimeType]: [`.${filename.split('.').pop()}`] },
                    }],
                })
                const writable = await handle.createWritable()
                await writable.write(blob)
                await writable.close()
                return
            } catch (err) {
                // Only log if it's not a user cancellation
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.warn('File System Access API failed, falling back:', err)
                }
            }
        }
        
        // Fallback to traditional method
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    } catch (error) {
        console.error('Error downloading file:', error)
        if (error instanceof Error && onError) {
            onError(error)
        }
    }
} 