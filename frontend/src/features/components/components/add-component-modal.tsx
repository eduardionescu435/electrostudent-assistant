import { useComponentStore, type Component } from "@/store/component-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ComponentForm } from "./component-form";
import { useState } from "react";

interface AddComponentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddComponentModal({ open, onOpenChange }: AddComponentModalProps) {
  const { createComponent, isLoading } = useComponentStore();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isOcrScannerOpen, setIsOcrScannerOpen] = useState(false);

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      document.querySelectorAll("video").forEach((video) => {
        const stream = video.srcObject as MediaStream | null;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          video.srcObject = null;
        }
      });
      setIsScannerOpen(false);
      setIsOcrScannerOpen(false);
    }
    onOpenChange(val);
  };

  const handleAdd = async (data: Partial<Component>) => {
    try {
      await createComponent(data);
      toast.success("Component added successfully");
      handleOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to add component");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-border/10">
        <DialogHeader className="px-8 pt-8 pb-4 text-left">
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">Add New Component</DialogTitle>
        </DialogHeader>

        <div className="px-8 pb-8">
          <ComponentForm
            onSubmit={handleAdd}
            isLoading={isLoading}
            submitLabel="Add Component"
            onCancel={() => handleOpenChange(false)}
            isScannerOpen={isScannerOpen}
            setIsScannerOpen={setIsScannerOpen}
            isOcrScannerOpen={isOcrScannerOpen}
            setIsOcrScannerOpen={setIsOcrScannerOpen}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
