import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface PinoutEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  componentId: number;
  componentName: string;
  initialPinoutData: Record<string, string> | null;
  onSave: (pinoutData: Record<string, string>) => Promise<void>;
}

interface PinEntry {
  pin: string;
  description: string;
}

export function PinoutEditorModal({
  open,
  onOpenChange,
  componentName,
  initialPinoutData,
  onSave,
}: PinoutEditorModalProps) {
  const [pins, setPins] = useState<PinEntry[]>(() => {
    if (!initialPinoutData || Object.keys(initialPinoutData).length === 0) {
      return [{ pin: "1", description: "" }];
    }
    return Object.entries(initialPinoutData).map(([pin, description]) => ({
      pin,
      description: String(description),
    }));
  });
  const [isSaving, setIsSaving] = useState(false);

  const addPin = () => {
    const nextPinNumber = pins.length > 0 
      ? Math.max(...pins.map(p => parseInt(p.pin) || 0)) + 1 
      : 1;
    setPins([...pins, { pin: nextPinNumber.toString(), description: "" }]);
  };

  const removePin = (index: number) => {
    if (pins.length === 1) {
      toast.error("Must have at least one pin");
      return;
    }
    setPins(pins.filter((_, i) => i !== index));
  };

  const updatePin = (index: number, field: "pin" | "description", value: string) => {
    const updated = [...pins];
    updated[index][field] = value;
    setPins(updated);
  };

  const handleSave = async () => {
    // Validate
    const uniquePins = new Set<string>();
    for (const entry of pins) {
      if (!entry.pin.trim()) {
        toast.error("Pin number cannot be empty");
        return;
      }
      if (uniquePins.has(entry.pin)) {
        toast.error(`Duplicate pin number: ${entry.pin}`);
        return;
      }
      uniquePins.add(entry.pin);
    }

    // Convert to pinout data object
    const pinoutData: Record<string, string> = {};
    pins.forEach(entry => {
      if (entry.pin.trim()) {
        pinoutData[entry.pin] = entry.description;
      }
    });

    setIsSaving(true);
    try {
      await onSave(pinoutData);
      toast.success("Pinout configuration saved");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save pinout configuration");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Edit Pinout Configuration</DialogTitle>
          <DialogDescription>
            Configure pin mappings for {componentName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-3 py-2 bg-muted/30 rounded-lg">
            <div className="col-span-3">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Pin #
              </span>
            </div>
            <div className="col-span-8">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Description
              </span>
            </div>
            <div className="col-span-1">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground text-center block">
                Action
              </span>
            </div>
          </div>

          {/* Pin Rows */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {pins.map((entry, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <Input
                    type="text"
                    placeholder="Pin number"
                    value={entry.pin}
                    onChange={(e) => updatePin(index, "pin", e.target.value)}
                    className="rounded-xl h-10 font-medium"
                  />
                </div>
                <div className="col-span-8">
                  <Input
                    type="text"
                    placeholder="Pin description (e.g., VCC, GND, DATA)"
                    value={entry.description}
                    onChange={(e) => updatePin(index, "description", e.target.value)}
                    className="rounded-xl h-10 font-medium"
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePin(index)}
                    className="h-10 w-10 text-destructive hover:bg-destructive/10"
                    disabled={pins.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Pin Button */}
          <Button
            variant="outline"
            onClick={addPin}
            className="w-full rounded-xl h-10 font-bold gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Pin
          </Button>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 rounded-xl h-11 font-bold gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Pinout"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="rounded-xl h-11 font-bold"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
