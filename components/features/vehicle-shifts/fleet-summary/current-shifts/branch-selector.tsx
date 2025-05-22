'use client'

import React from 'react'
import type { Branch } from "@/types/domain/admin/types"
import { Button, Label } from "@/components/ui"
import { cn } from '@/utils/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranch: string;
  onSelectBranch: (branchId: string) => void;
  isLoading: boolean;
}

export function BranchSelector({ branches, selectedBranch, onSelectBranch, isLoading }: BranchSelectorProps) {
  if (branches.length === 0) return null;

  return (
    <div className="flex items-center gap-2 pt-4 flex-wrap">
      <Label className="text-sm text-muted-foreground">Sucursal:</Label>
      {branches.map((branch) => (
        <Button
          key={branch.id}
          variant={selectedBranch === branch.id ? "default" : "outline"}
          onClick={() => onSelectBranch(branch.id)}
          disabled={isLoading}
          className={cn(selectedBranch === branch.id && "bg-transvip text-white hover:bg-transvip/90")}
        >
          {branch.name}
        </Button>
      ))}
    </div>
  );
} 