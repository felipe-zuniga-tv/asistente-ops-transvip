"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableSelectProps<TData> {
  table: Table<TData>;
  options: { label: string; value: string }[];
  placeholder?: string;
  filterColumnId: string;
  className?: string;
}

export function DataTableSelect<TData>({
  table,
  options,
  placeholder = "Seleccionar...",
  filterColumnId,
  className,
}: DataTableSelectProps<TData>) {
  const [value, setValue] = React.useState<string>("");

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    table.getColumn(filterColumnId)?.setFilterValue(newValue === "all" ? undefined : newValue);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 