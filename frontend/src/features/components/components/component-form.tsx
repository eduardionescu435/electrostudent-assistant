import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { type Component } from "@/store/component-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, ScanLine, FileText, Package, Sparkles } from "lucide-react";
import { BarcodeScanner } from "./barcode-scanner";

interface ComponentFormProps {
  initialData?: Partial<Component>;
  onSubmit: (data: Partial<Component>) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
  onCancel: () => void;
  isScannerOpen?: boolean;
  setIsScannerOpen?: Dispatch<SetStateAction<boolean>>;
  isOcrScannerOpen?: boolean;
  setIsOcrScannerOpen?: Dispatch<SetStateAction<boolean>>;
}

export function ComponentForm({ 
  initialData, 
  onSubmit, 
  isLoading, 
  submitLabel,
  onCancel,
  isScannerOpen: isScannerOpenProp,
  setIsScannerOpen: setIsScannerOpenProp,
  isOcrScannerOpen: isOcrScannerOpenProp,
  setIsOcrScannerOpen: setIsOcrScannerOpenProp,
}: ComponentFormProps) {
  const [formData, setFormData] = useState<Partial<Component>>({
    name: "",
    category: "IC",
    manufacturer: "",
    identification_code: "",
    quantity: 0,
    location: "",
    notes: "",
    ...initialData
  });

  const [isScannerOpenInternal, setIsScannerOpenInternal] = useState(false);
  const [isOcrScannerOpenInternal, setIsOcrScannerOpenInternal] = useState(false);

  const isScannerOpen = isScannerOpenProp ?? isScannerOpenInternal;
  const setIsScannerOpen = setIsScannerOpenProp ?? setIsScannerOpenInternal;
  const isOcrScannerOpen = isOcrScannerOpenProp ?? isOcrScannerOpenInternal;
  const setIsOcrScannerOpen = setIsOcrScannerOpenProp ?? setIsOcrScannerOpenInternal;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [ocrImagePreview, setOcrImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({ ...prev, ...initialData }));
      setImagePreview(initialData.image_url || null);
    }
  }, [initialData?.id]); 

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAnalyze = async (sourceOverride?: string) => {
    let blob: Blob | null = null;
    
    if (sourceOverride) {
      const res = await fetch(sourceOverride);
      blob = await res.blob();
    } else if (imageFile) {
      blob = imageFile;
    }

    if (!blob) return;
    
    setIsAiAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("image", blob, "component.png");

      const response = await fetch("/api/components/analyze-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze image with Gemini");
      
      const parsedData = await response.json();
      
      setFormData(prev => ({
        ...prev,
        name: parsedData.name || prev.name,
        category: parsedData.category || prev.category,
        manufacturer: parsedData.manufacturer || prev.manufacturer,
        identification_code: parsedData.identification_code || prev.identification_code,
        quantity: parsedData.quantity !== null && parsedData.quantity !== undefined ? parsedData.quantity : prev.quantity,
      }));
    } catch (error: any) {
      console.error("AI Error:", error);
      alert(error.message || "Gemini failed to analyze the component.");
    } finally {
      setIsAiAnalyzing(false);
      setOcrImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, image: imageFile } as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Image Upload Section */}
      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-dashed border-border/50 bg-muted/5 transition-all hover:bg-muted/10 group relative">
        {imagePreview ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-lg border border-border/20">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity">
              <div className="flex gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById("image-upload")?.click()}>
                  Change Image
                </Button>
                <Button 
                  type="button" 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleAIAnalyze()} 
                  disabled={isAiAnalyzing || !imageFile}
                  className="bg-primary hover:bg-primary/90 font-bold gap-2"
                >
                  {isAiAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  {isAiAnalyzing ? "Gemini Analyzing..." : "Analyze with AI"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center w-full h-32 cursor-pointer"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <div className="p-3 rounded-full bg-primary/5 text-primary mb-2">
              <Package className="h-6 w-6" />
            </div>
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Upload Component Image</span>
            <span className="text-[10px] text-muted-foreground/50 mt-1 italic">PNG, JPG up to 5MB</span>
          </div>
        )}
        <input 
          id="image-upload" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleImageChange} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column: Basic Info */}
        <div className="space-y-6">
          <div className="space-y-2.5">
            <Label htmlFor="name" className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest pl-0.5">
              Component Name <span className="text-destructive">*</span>
            </Label>
            <Input 
              id="name" 
              placeholder="e.g. NE555P" 
              required 
              className="h-[44px] min-h-[44px] w-full rounded-lg border-border/50 bg-background px-4 text-[14px] focus:ring-1 focus:ring-primary/20 transition-all"
              value={formData.name || ""}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-5 py-1">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest pl-0.5">Category</Label>
              <Select 
                value={formData.category || ""} 
                onValueChange={(val) => setFormData({...formData, category: val})}
              >
                <SelectTrigger id="category" className="h-[44px] min-h-[44px] w-full rounded-lg border-border/50 bg-background text-foreground flex items-center justify-between px-4 text-[14px] focus:ring-1 focus:ring-primary/20 transition-all">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IC">IC</SelectItem>
                  <SelectItem value="Resistor">Resistor</SelectItem>
                  <SelectItem value="Capacitor">Capacitor</SelectItem>
                  <SelectItem value="Transistor">Transistor</SelectItem>
                  <SelectItem value="Diode">Diode</SelectItem>
                  <SelectItem value="Sensor">Sensor</SelectItem>
                  <SelectItem value="Module">Module</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest pl-0.5">Quantity</Label>
              <Input 
                id="quantity" 
                type="number" 
                min="0"
                className="h-11 w-full rounded-lg border-border/50 bg-background px-4 text-sm"
                value={formData.quantity ?? 0}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="manufacturer" className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest pl-0.5">Manufacturer</Label>
            <Input 
              id="manufacturer" 
              placeholder="e.g. Texas Instruments"
              className="h-[44px] min-h-[44px] w-full rounded-lg border-border/50 bg-background px-4 text-[14px] focus:ring-1 focus:ring-primary/20 transition-all"
              value={formData.manufacturer || ""}
              onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
            />
          </div>
        </div>

        {/* Right Column: Tracking & Storage */}
        <div className="space-y-6">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between h-5">
              <Label htmlFor="code" className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                Identification Code
              </Label>
              <div className="flex items-center gap-1 p-0.5 rounded-md bg-muted/50 border border-border/10">
                <button 
                  type="button" 
                  className={`p-1 transition-colors rounded ${isScannerOpen ? 'text-primary bg-primary/10' : 'hover:text-primary'}`} 
                  title="Scan QR/Barcode"
                  onClick={() => setIsScannerOpen(!isScannerOpen)}
                >
                  <ScanLine className="h-3.5 w-3.5" />
                </button>
                <div className="w-px h-3 bg-border/20 mx-0.5" />
                <button 
                  type="button" 
                  className={`p-1 transition-colors rounded ${isAiAnalyzing ? 'animate-pulse text-primary' : 'hover:text-primary'} ${isOcrScannerOpen ? 'text-primary bg-primary/10' : ''}`} 
                  title="AI Analysis (Camera or Image)"
                  onClick={() => setIsOcrScannerOpen(!isOcrScannerOpen)}
                  disabled={isAiAnalyzing}
                >
                  <FileText className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {isScannerOpen && (
              <div className="mb-4 p-4 rounded-2xl bg-muted/10 border border-border/20 overflow-hidden">
                <BarcodeScanner 
                  mode="scan"
                  onScan={(code) => {
                    setFormData(prev => ({ ...prev, identification_code: code }));
                    setIsScannerOpen(false);
                  }}
                  onClose={() => setIsScannerOpen(false)}
                />
              </div>
            )}
            {isOcrScannerOpen && (
              <div className="mb-4 p-4 rounded-2xl bg-muted/10 border border-border/20 overflow-hidden">
                <BarcodeScanner 
                  mode="ocr"
                  onCapture={(dataUrl) => {
                    setOcrImagePreview(dataUrl);
                    setIsOcrScannerOpen(false);
                    handleAIAnalyze(dataUrl);
                  }}
                  onClose={() => setIsOcrScannerOpen(false)}
                />
              </div>
            )}
            {isAiAnalyzing && ocrImagePreview && (
              <div className="mb-4 p-4 rounded-2xl bg-muted/10 border border-border/20 overflow-hidden flex flex-col items-center justify-center gap-4">
                <div className="w-full relative rounded-xl overflow-hidden aspect-square flex items-center justify-center bg-black/90">
                  <img src={ocrImagePreview} alt="OCR Target" className="w-full h-full object-contain filter brightness-[0.4]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-black/60 px-4 py-2 rounded-full backdrop-blur-md">Extracting AI Data...</span>
                  </div>
                </div>
              </div>
            )}
            <Input 
              id="code" 
              placeholder="Barcode or Serial Number"
              className="h-[44px] min-h-[44px] w-full rounded-lg border-border/50 bg-background px-4 text-[14px] focus:ring-1 focus:ring-primary/20 transition-all font-mono"
              value={formData.identification_code || ""}
              onChange={(e) => setFormData({...formData, identification_code: e.target.value})}
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="location" className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest pl-0.5">Storage Location</Label>
            <Input 
              id="location" 
              placeholder="e.g. Box A, Drawer 3"
              className="h-[44px] min-h-[44px] w-full rounded-lg border-border/50 bg-background px-4 text-[14px] focus:ring-1 focus:ring-primary/20 transition-all"
              value={formData.location || ""}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="notes" className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest pl-0.5">Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Describe pins or features..." 
              className="min-h-[100px] w-full rounded-lg border-border/50 bg-background px-4 py-3 text-[14px] resize-none focus:ring-1 focus:ring-primary/20 transition-all"
              value={formData.notes || ""}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-6 border-t border-border/10 gap-3">
        <Button type="button" variant="ghost" className="h-11 px-6 rounded-lg font-medium" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="h-11 px-8 rounded-lg font-bold gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
