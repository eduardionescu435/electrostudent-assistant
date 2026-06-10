import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, Layers, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PinoutViewerProps {
  pinoutData: Record<string, string> | null;
  componentName?: string;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export function PinoutViewer({ pinoutData, componentName, onEdit, showEditButton = false }: PinoutViewerProps) {
  if (!pinoutData || Object.keys(pinoutData).length === 0) {
    return (
      <Card className="border-border shadow-sm rounded-3xl bg-background/50 backdrop-blur-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />
            Pinout Configuration
          </CardTitle>
          {showEditButton && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="h-8 rounded-lg gap-2 font-bold"
            >
              <Edit className="h-3 w-3" />
              Add Pinout
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 gap-3 opacity-30 grayscale">
            <Layers className="h-10 w-10 stroke-1" />
            <p className="text-xs font-medium">No pinout data provided</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pinEntries = Object.entries(pinoutData).sort((a, b) => {
    const numA = parseInt(a[0]) || 0;
    const numB = parseInt(b[0]) || 0;
    return numA - numB;
  });
  const pinCount = pinEntries.length;

  return (
    <Card className="border-border shadow-sm rounded-3xl bg-background/50 backdrop-blur-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />
            Pinout Configuration
          </CardTitle>
          {componentName && (
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {componentName} • {pinCount} {pinCount === 1 ? 'pin' : 'pins'}
            </p>
          )}
        </div>
        {showEditButton && onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8 rounded-lg gap-2 font-bold"
          >
            <Edit className="h-3 w-3" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-black text-xs uppercase tracking-wider w-[120px]">
                  Pin #
                </TableHead>
                <TableHead className="font-black text-xs uppercase tracking-wider">
                  Description
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pinEntries.map(([pin, desc]: [string, any]) => (
                <TableRow key={pin} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-bold">
                    <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-black">
                      Pin {pin}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-muted-foreground">
                    {String(desc) || <span className="italic opacity-50">No description</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

