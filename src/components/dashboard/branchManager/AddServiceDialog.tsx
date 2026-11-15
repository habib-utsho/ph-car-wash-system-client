"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ServiceForm from "./ServiceForm";

// "Add Service" button and the modal that holds the form.
const AddServiceDialog = () => {
  const [open, setOpen] = useState(false);
  const handleSuccess = useCallback(() => setOpen(false), []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="h-9 bg-[#15295e] text-white hover:bg-[#1e3a80]" />
        }
      >
        <Plus data-icon="inline-start" />
        Add Service
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a service</DialogTitle>
          <DialogDescription>
            Create a service for your branch. It will appear in your table.
          </DialogDescription>
        </DialogHeader>

        <ServiceForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceDialog;
