'use client'

import { Card } from "@/components/ui"
import { Loader2 } from "lucide-react";

export function LoadingIndicator() {
  return (
    <Card className="p-6">
      <div className="text-center text-muted-foreground py-8 flex items-center gap-2 justify-center">
        <Loader2 className="w-6 h-6 animate-spin" /> Cargando datos...
      </div>
    </Card>
  );
} 