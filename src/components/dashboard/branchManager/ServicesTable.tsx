import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TService } from "@/types";

type ServicesTableProps = {
  services: TService[];
};

// Table of the services the branch manager created.
const ServicesTable = ({ services }: ServicesTableProps) => {
  if (services.length === 0) {
    return (
      <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
        You have not added any services yet. Click Add Service to create your first one.
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Name</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Slot</TableHead>
            <TableHead className="pr-4">Features</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service._id}>
              <TableCell className="pl-4 font-medium">{service.name}</TableCell>
              <TableCell>{service.branch}</TableCell>
              <TableCell>৳ {service.price}</TableCell>
              <TableCell>{service.duration} min</TableCell>
              <TableCell>{service.slot || "—"}</TableCell>
              <TableCell className="pr-4">
                {service.keyFeatures.length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicesTable;
