import { useState, useCallback } from 'react';
import type { UseClipboardOptions, UseClipboardReturn } from '@/types/hooks/use-clipboard';

// interface UseClipboardOptions { // Removed
//   timeout?: number;
// }

// interface UseClipboardReturn { // Removed
//   copyToClipboard: (text: string) => Promise<void>;
//   isCopied: boolean;
//   error: Error | null;
// }

const useClipboard = ({ timeout = 2000 }: UseClipboardOptions = {}): UseClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      setIsCopied(true);
      setError(null);

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to copy text to clipboard'));
      setIsCopied(false);
    }
  }, [timeout]);

  return { copyToClipboard, isCopied, error };
};

export default useClipboard;