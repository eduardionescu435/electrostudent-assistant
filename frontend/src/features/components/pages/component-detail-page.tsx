import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useComponentStore, type Component } from "@/store/component-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PinoutViewer } from "@/components/pinout-viewer";
import { PinoutEditorModal } from "../components/pinout-editor-modal";
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  Upload,
  Trash2,
  Loader2,
  Package,
  Info,
  Layers,
  MapPin,
  Calendar,
  Settings2,
  X,
  ZoomIn
} from "lucide-react";
import { toast } from "sonner";
import { EditComponentModal } from "../components/edit-component-modal";

export function ComponentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchComponentById, updateComponent, deleteComponent } = useComponentStore();
  const [component, setComponent] = useState<Component | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPinoutEditorOpen, setIsPinoutEditorOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      loadComponent();
    }
  }, [id]);

  const loadComponent = async () => {
    setIsLoading(true);
    try {
      const data = await fetchComponentById(Number(id));
      setComponent(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load component");
      navigate("/inventory");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !component) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsUploading(true);
    try {
      const updated = await updateComponent(component.id, { datasheet: file });
      setComponent(updated);
      toast.success("Datasheet uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload datasheet");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteEntry = async () => {
    if (!component || !window.confirm(`Are you sure you want to delete ${component.name}?`)) return;

    try {
      await deleteComponent(component.id);
      toast.success("Component deleted successfully");
      navigate("/inventory");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete component");
    }
  };

  const handleSavePinout = async (pinoutData: Record<string, string>) => {
    if (!component) return;
    
    const updated = await updateComponent(component.id, { pinout_data: pinoutData });
    setComponent(updated);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
        <p className="text-muted-foreground font-medium">Loading component details...</p>
      </div>
    );
  }

  if (!component) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          className="group w-fit h-8 px-4 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/inventory")}
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Inventory
        </Button>

        <Card className="border-border shadow-md rounded-3xl overflow-hidden bg-background/50 backdrop-blur-sm">
          <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter">{component.name}</h1>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1">
                  {component.category}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-4 gap-x-10 text-xs md:text-sm border-t border-border/10 pt-6">
              <div className="flex flex-col gap-1 min-w-[120px]">
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Identification Code</span>
                <span className="font-mono text-base md:text-lg font-bold tracking-tight break-all">{component.identification_code || "N/A"}</span>
              </div>
              <div className="hidden md:block h-10 w-px bg-border/20" />
              <div className="flex flex-col gap-1 min-w-[120px]">
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Manufacturer</span>
                <span className="text-base md:text-lg font-bold tracking-tight">{component.manufacturer || "N/A"}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card className="overflow-hidden border-border shadow-md rounded-3xl py-0 bg-background/50 backdrop-blur-sm">
            <div className="aspect-21/9 relative bg-muted/30 overflow-hidden group">
              {component.image_url ? (
                <>
                  <img
                    src={component.image_url}
                    alt={component.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                    onClick={() => setIsImageModalOpen(true)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-sm rounded-full p-3">
                      <ZoomIn className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-muted-foreground/30">
                  <Package className="h-20 w-20 stroke-[0.5]" />
                  <p className="text-sm font-medium">No component image available</p>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5 text-center p-4 rounded-2xl bg-background border border-border/50 shadow-xs">
                  <Package className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Quantity</p>
                  <p className="text-3xl font-black tracking-tight">{component.quantity}</p>
                </div>
                <div className="space-y-1.5 text-center p-4 rounded-2xl bg-background border border-border/50 shadow-xs">
                  <MapPin className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Location</p>
                  <p className="text-lg font-black truncate px-2">{component.location || "N/A"}</p>
                </div>
                <div className="space-y-1.5 text-center p-4 rounded-2xl bg-background border border-border/50 shadow-xs">
                  <Layers className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Category</p>
                  <p className="text-lg font-black">{component.category}</p>
                </div>
                <div className="space-y-1.5 text-center p-4 rounded-2xl bg-background border border-border/50 shadow-xs">
                  <Calendar className="h-5 w-5 mx-auto mb-2 text-rose-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Added On</p>
                  <p className="text-xs font-black">{new Date(component.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border shadow-sm rounded-3xl bg-background/50 backdrop-blur-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Notes & Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap min-h-25">
                  {component.notes || "No additional notes for this component."}
                </p>
              </CardContent>
            </Card>

            <PinoutViewer 
              pinoutData={component.pinout_data} 
              componentName={component.name}
              onEdit={() => setIsPinoutEditorOpen(true)}
              showEditButton={true}
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="border-border shadow-md rounded-3xl overflow-hidden py-0 bg-background/50 backdrop-blur-sm">
            <CardHeader className="bg-primary/5 border-b border-border/50 p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Datasheet
                </CardTitle>
                {component.datasheet_url && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-none">Attached</Badge>
                )}
              </div>
              <CardDescription className="text-xs font-medium opacity-60">Technical reference and specifications</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {component.datasheet_url ? (
                <div className="space-y-4">
                  <div className="aspect-4/5 w-full bg-muted/20 rounded-xl border border-dashed border-border/50 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-muted/40 transition-colors" onClick={() => window.open(component.datasheet_url!, '_blank')}>
                    <FileText className="h-20 w-20 text-muted-foreground/20 group-hover:text-primary/40 transition-all duration-300" />
                    <div className="text-center">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Datasheet Preview</p>
                      <Button variant="link" className="text-primary gap-1 h-3 p-0 text-xs">
                        <ExternalLink className="h-3 w-3" />
                        Open PDF In Tab
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-lg h-10 text-xs font-bold gap-2"
                      onClick={() => window.open(component.datasheet_url!, '_blank')}
                    >
                      View Full PDF
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-lg"
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to remove this datasheet?")) {
                          setIsUploading(true);
                          try {
                            const updated = await updateComponent(component.id, { datasheet_url: "" });
                            setComponent(updated);
                            toast.success("Datasheet removed");
                          } catch (error: any) {
                            toast.error(error.message || "Failed to remove datasheet");
                          } finally {
                            setIsUploading(false);
                          }
                        }
                      }}
                      disabled={isUploading}
                    >
                      {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 gap-6 border-2 border-dashed border-border/20 rounded-2xl bg-muted/5 transition-all hover:bg-muted/10 hover:border-primary/20 group">
                  <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Upload className="h-8 w-8 text-primary shadow-sm" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-bold text-sm tracking-tight text-foreground">Upload Component PDF</p>
                    <p className="text-muted-foreground text-[11px] max-w-37.5 mx-auto leading-relaxed">Select a datasheet for technical specifications</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button
                    className="w-full rounded-xl h-11 font-bold gap-2 shadow-sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {isUploading ? "Uploading..." : "Select PDF Document"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-md rounded-3xl bg-background/50 backdrop-blur-sm overflow-hidden py-0">
            <CardHeader className="pb-3 border-b border-border bg-muted/20 p-6">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-2">
              <Button
                variant="ghost"
                className="justify-start gap-3 h-12 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary transition-all group"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Settings2 className="h-4 w-4 group-hover:rotate-45 transition-transform" />
                Edit Component
              </Button>
              <Button
                variant="ghost"
                className="justify-start gap-3 h-12 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all"
                onClick={handleDeleteEntry}
              >
                <Trash2 className="h-4 w-4" />
                Delete Entry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <EditComponentModal
        component={component}
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) loadComponent();
        }}
      />

      <PinoutEditorModal
        open={isPinoutEditorOpen}
        onOpenChange={setIsPinoutEditorOpen}
        componentId={component.id}
        componentName={component.name}
        initialPinoutData={component.pinout_data}
        onSave={handleSavePinout}
      />

      {isImageModalOpen && component.image_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setIsImageModalOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsImageModalOpen(false)}
          role="dialog"
          tabIndex={-1}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <button
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={() => setIsImageModalOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>

          <img
            src={component.image_url}
            alt={component.name}
            className="relative z-10 max-h-full max-w-full rounded-2xl object-contain shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-center">
            <p className="text-white/80 text-sm font-bold tracking-wide">{component.name}</p>
            <p className="text-white/40 text-xs">{component.category} · {component.manufacturer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
