export interface UseClipboardOptions {
  timeout?: number;
}

export interface UseClipboardReturn {
  copyToClipboard: (text: string) => Promise<void>;
  isCopied: boolean;
  error: Error | null;
} 