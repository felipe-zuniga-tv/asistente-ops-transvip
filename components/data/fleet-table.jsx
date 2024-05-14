import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
export default function FleetData({ data, handleCheckboxChange }) {
  return (
    <Table className="bg-white">
        <TableCaption>Conductores consultados</TableCaption>
        <TableHeader className="bg-slate-900 text-white">
          <TableRow>
            <TableHead className="w-[100px] text-white text-center">Check</TableHead>
            <TableHead className="text-white text-center">Status</TableHead>
            <TableHead className="text-white text-center">Nombre</TableHead>
            <TableHead className="text-white text-center">Email</TableHead>
            <TableHead className="text-white text-center">Teléfono</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} className={`${index % 2 === 0 ? 'bg-red-200' : 'bg-green-100'}`}>
              <TableCell className="font-medium">
                <input 
                    type="checkbox" 
                    onChange={() => handleCheckboxChange(index)} 
                />
              </TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">{ data.length } conductores</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
  );
}