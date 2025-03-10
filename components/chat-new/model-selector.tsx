'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ModelSelectorProps {
  selectedModelId: string;
  className?: string;
}

// This can be expanded based on your available models
const CHAT_MODELS = [
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus' },
  { id: 'gpt-4o', name: 'GPT-4o' },
];

export function ModelSelector({ selectedModelId, className }: ModelSelectorProps) {
  const [value, setValue] = useState(selectedModelId);
  const router = useRouter();

  return (
    <div className={className}>
      <Select
        value={value}
        onValueChange={(value) => {
          setValue(value);
          // In a real implementation, you would save this to cookies or local storage
          // and potentially redirect or refresh the page
          router.refresh();
        }}
      >
        <SelectTrigger className="w-[180px] h-9 text-xs focus:ring-0 data-[state=open]:ring-0">
          <SelectValue placeholder="Seleccionar modelo" />
        </SelectTrigger>
        <SelectContent className="w-[180px]">
          <SelectGroup>
            {CHAT_MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id} className="text-xs">
                {model.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
} 