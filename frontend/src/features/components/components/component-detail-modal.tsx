import { type Component } from "@/store/component-store";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  MapPin,
  Tag,
  Hammer,
  Hash,
  StickyNote,
  Calendar,
  Pencil,
  Trash2,
  ExternalLink,
  X
} from "lucide-react";
import { format } from "date-fns";

interface ComponentDetailModalProps {
  component: Component | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (component: Component) => void;
  onDelete: (component: Component) => void;
}

export function ComponentDetailModal({
  component,
  open,
  onOpenChange,
  onEdit,
  onDelete
}: ComponentDetailModalProps) {
  if (!component) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden p-0 gap-0 border-border/10 rounded-2xl shadow-2xl">
        <div className="relative h-56 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/5 dark:to-white/5 opacity-50" />
          {component.image_url ? (
            <img src={component.image_url} alt={component.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="flex flex-col items-center gap-4 text-muted-foreground/20">
              <Package className="h-20 w-20 stroke-1" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Inventory Asset</span>
            </div>
          )}
          <div className="absolute top-5 left-5">
            <Badge className="bg-white/80 dark:bg-black/80 backdrop-blur-xl text-foreground border-none px-3 py-1 shadow-sm text-[11px] font-bold uppercase tracking-wider">
              {component.category || "General"}
            </Badge>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 backdrop-blur-md transition-all border border-white/10 group/close"
          >
            <X className="h-4 w-4 text-white group-hover/close:scale-110 transition-transform" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(85vh - 224px)' }}>
          <div className="p-10 space-y-10">
            <div className="space-y-3">
              <h2 className="text-4xl font-black tracking-tighter text-foreground">{component.name}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary">
                  <Hammer className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold uppercase tracking-wide">{component.manufacturer || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border/50 text-muted-foreground font-mono">
                  <Hash className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold">{component.identification_code || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-primary/40" /> Storage Location
                </span>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/40 font-bold text-sm">
                  {component.location || "Not assigned"}
                </div>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <Tag className="h-3 w-3 text-primary/40" /> Current Stock
                </span>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/40 font-bold text-sm flex items-center justify-between">
                  <span>{component.quantity} Units</span>
                  <div className={`h-2 w-2 rounded-full ${component.quantity > 5 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-destructive animate-pulse shadow-[0_0_10px_#ef4444]'}`} />
                </div>
              </div>
            </div>

            {component.notes && (
              <div className="space-y-4">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <StickyNote className="h-3 w-3 text-primary/40" /> Engineering Notes
                </span>
                <div className="p-5 rounded-xl bg-neutral-900/2 dark:bg-white/2 border border-border/20 text-sm leading-relaxed text-muted-foreground italic">
                  "{component.notes}"
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-10 border-t border-border/10">
              <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                <Calendar className="h-3.5 w-3.5" />
                Asset Added {format(new Date(component.created_at), "MMM d, yyyy")}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="h-10 px-5 rounded-lg gap-2 font-bold hover:bg-primary hover:text-primary-foreground transition-all" onClick={() => onEdit(component)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button variant="ghost" className="h-10 px-5 rounded-lg gap-2 text-destructive font-bold hover:bg-destructive/10" onClick={() => onDelete(component)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        {component.datasheet_url && (
          <div className="p-8 pt-0">
            <Button
              className="w-full h-14 rounded-xl gap-3 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/10"
              onClick={() => window.open(component.datasheet_url!, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Analyze Technical Datasheet
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
