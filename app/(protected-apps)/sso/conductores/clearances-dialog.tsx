'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // For date inputs initially
import { ScrollArea } from '@/components/ui/scroll-area'; // For long lists of divisions
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // For status

import type { DriverWithClearances, Division, DriverDivisionClearance } from '@/types/domain/seguridad';

// Define possible clearance statuses
const CLEARANCE_STATUSES = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'APPROVED', label: 'Aprobado' },
  { value: 'REJECTED', label: 'Rechazado' },
  { value: 'EXPIRED', label: 'Expirado' },
  { value: 'REVOKED', label: 'Revocado' },
];

interface ClearanceFormItem {
  division_id: string;
  division_name: string;
  is_cleared: boolean;
  status?: string;
  valid_from?: string;
  valid_until?: string;
}

interface ClearancesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    driverId: string,
    clearances: Array<Pick<DriverDivisionClearance, 'division_id' | 'is_cleared' | 'status' | 'valid_from' | 'valid_until'>>
  ) => Promise<void>;
  driver: DriverWithClearances;
  allDivisions: Division[];
}

export function ClearancesDialog({
  isOpen,
  onClose,
  onSave,
  driver,
  allDivisions,
}: ClearancesDialogProps) {
  const [clearanceItems, setClearanceItems] = useState<ClearanceFormItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && driver && allDivisions) {
      const initialItems = allDivisions.map(div => {
        const existingClearance = driver.clearances.find(c => c.division_id === div.id);
        return {
          division_id: div.id,
          division_name: div.name,
          is_cleared: existingClearance?.is_cleared || false,
          status: existingClearance?.status || CLEARANCE_STATUSES[0].value, // Default to PENDING
          valid_from: existingClearance?.valid_from ? new Date(existingClearance.valid_from).toISOString().split('T')[0] : '',
          valid_until: existingClearance?.valid_until ? new Date(existingClearance.valid_until).toISOString().split('T')[0] : '',
        };
      });
      setClearanceItems(initialItems);
    } else if (!isOpen) {
        setClearanceItems([]); // Reset when closed
    }
  }, [isOpen, driver, allDivisions]);

  const handleItemChange = (divisionId: string, field: keyof ClearanceFormItem, value: any) => {
    setClearanceItems(prevItems =>
      prevItems.map(item =>
        item.division_id === divisionId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const clearancesToSave = clearanceItems
      .filter(item => item.is_cleared || item.status || item.valid_from || item.valid_until) // Only save if there's some data
      .map(item => ({
        division_id: item.division_id,
        is_cleared: item.is_cleared,
        status: item.status,
        // Ensure dates are in ISO format or null if empty
        valid_from: item.valid_from ? new Date(item.valid_from).toISOString() : undefined,
        valid_until: item.valid_until ? new Date(item.valid_until).toISOString() : undefined,
      }));
    await onSave(driver.id, clearancesToSave);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Gestionar Habilitaciones para: {driver.name}</DialogTitle>
          <DialogDescription>
            Seleccione las divisiones y configure el estado de habilitación.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
          <div className="space-y-4 py-4 pr-4">
            {clearanceItems.map(item => (
              <div key={item.division_id} className="p-3 border rounded-md space-y-3">
                <div className="flex items-center justify-between">
                    <Label htmlFor={`cleared-${item.division_id}`} className="font-semibold text-md">
                        {item.division_name}
                    </Label>
                    <Checkbox
                        id={`cleared-${item.division_id}`}
                        checked={item.is_cleared}
                        onCheckedChange={checked =>
                        handleItemChange(item.division_id, 'is_cleared', !!checked)
                        }
                    />
                </div>

                {item.is_cleared && (
                  <div className="space-y-3 pl-2 border-l-2 ml-2">
                    <div>
                      <Label htmlFor={`status-${item.division_id}`}>Estado</Label>
                      <Select
                        value={item.status}
                        onValueChange={value => handleItemChange(item.division_id, 'status', value)}
                      >
                        <SelectTrigger id={`status-${item.division_id}`}>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {CLEARANCE_STATUSES.map(statusOpt => (
                            <SelectItem key={statusOpt.value} value={statusOpt.value}>
                              {statusOpt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor={`valid_from-${item.division_id}`}>Válido Desde</Label>
                            <Input
                                id={`valid_from-${item.division_id}`}
                                type="date"
                                value={item.valid_from}
                                onChange={e =>
                                handleItemChange(item.division_id, 'valid_from', e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor={`valid_until-${item.division_id}`}>Válido Hasta</Label>
                            <Input
                                id={`valid_until-${item.division_id}`}
                                type="date"
                                value={item.valid_until}
                                onChange={e =>
                                handleItemChange(item.division_id, 'valid_until', e.target.value)
                                }
                            />
                        </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Habilitaciones'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 