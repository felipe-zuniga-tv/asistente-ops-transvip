'use client'

interface EmptyStateMessageProps {
  message: string;
}

export function EmptyStateMessage({ message }: EmptyStateMessageProps) {
  return (
    <div className="text-center text-muted-foreground py-8">
      {message}
    </div>
  );
} 