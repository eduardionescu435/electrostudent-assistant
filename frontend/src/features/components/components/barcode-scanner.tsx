import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { X, Camera, RefreshCw, AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BarcodeScannerProps {
  mode?: "scan" | "ocr";
  onScan?: (decodedText: string) => void;
  onCapture?: (dataUrl: string) => void;
  onClose: () => void;
}

const ALL_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.PDF_417,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
];

const CONSTRUCTOR_CONFIG = {
  formatsToSupport: ALL_FORMATS,
  verbose: false,
};

export function BarcodeScanner({ mode = "scan", onScan, onCapture, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isMountedRef = useRef(true);
  const regionId = "barcode-scanner-region";
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const stopCamera = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (e) {
      console.warn("Graceful stop failed:", e);
    }
  };

  const handleClose = async () => {
    await stopCamera();
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleManualCapture = async () => {
    try {
      const container = document.getElementById(regionId);
      const video = container?.querySelector("video");
      if (!video) throw new Error("Video feed not found");

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");

      await stopCamera();
      onCapture?.(dataUrl);
    } catch (err: any) {
      console.error("Capture error:", err);
      setError("Failed to capture image: " + err.message);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";

    if (mode === "ocr") {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await stopCamera();
        onCapture?.(reader.result as string);
      };
      reader.readAsDataURL(file);
      return;
    }

    // --- scan mode ---
    setIsScanning(true);
    setError(null);

    try {
      await stopCamera();

      const fileScanner = new Html5Qrcode(regionId, CONSTRUCTOR_CONFIG);

      const decodedText = await fileScanner.scanFile(file, false);

      fileScanner.clear();
      onScan?.(decodedText);
    } catch (err: any) {
      console.error("File scan error:", err);
      setError(
        "No barcode or QR code found in the image. " +
        "Try a clearer, well-lit photo with the code fully in frame."
      );

      restartCamera();
    } finally {
      setIsScanning(false);
    }
  };

  const restartCamera = () => {
    if (!isMountedRef.current) return;

    const html5QrCode = new Html5Qrcode(regionId, CONSTRUCTOR_CONFIG);
    scannerRef.current = html5QrCode;

    const cameraConfig = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    html5QrCode
      .start(
        { facingMode: "environment" },
        cameraConfig,
        async (decodedText) => {
          if (mode === "ocr") return;
          await stopCamera();
          onScan?.(decodedText);
        },
        () => {}
      )
      .then(() => {
        if (isMountedRef.current) {
          setIsStarted(true);
          setError(null);
        } else {
          stopCamera().catch(() => {});
        }
      })
      .catch((err: any) => {
        if (isMountedRef.current) {
          console.error("Failed to start scanner:", err);
          setError(err.message || "Failed to access camera.");
        }
      });
  };

  useEffect(() => {
    if (scannerRef.current) return;

    const html5QrCode = new Html5Qrcode(regionId, CONSTRUCTOR_CONFIG);
    scannerRef.current = html5QrCode;

    const cameraConfig = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    html5QrCode
      .start(
        { facingMode: "environment" },
        cameraConfig,
        async (decodedText) => {
          if (mode === "ocr") return;
          await stopCamera();
          onScan?.(decodedText);
        },
        () => {}
      )
      .then(() => {
        if (isMountedRef.current) {
          setIsStarted(true);
          setError(null);
        } else {
          stopCamera().catch(() => {});
        }
      })
      .catch((err: any) => {
        if (isMountedRef.current) {
          console.error("Failed to start scanner:", err);
          setError(err.message || "Failed to access camera.");
        }
      });

    return () => {
      stopCamera().catch(() => {});
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-foreground font-bold text-sm uppercase tracking-widest">
          <Camera className="h-4 w-4" />
          {mode === "ocr" ? "AI OCR Precision Mode" : "Camera Scanner"}
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 rounded-full">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold uppercase tracking-tight text-xs">Scan Error</AlertTitle>
          <AlertDescription className="text-xs font-medium opacity-90">
            {error}
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setError(null);
              restartCamera();
            }}
            className="mt-3 w-full border-destructive/30 hover:bg-destructive/10 hover:text-destructive font-bold text-xs rounded-lg"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Retry Connection
          </Button>
        </Alert>
      ) : (
        <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-border/40 bg-muted/20 aspect-square flex items-center justify-center">
          <div id={regionId} className="w-full h-full object-cover" />

          {!isStarted && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/40" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 animate-pulse">
                Initializing Lens...
              </span>
            </div>
          )}

          {/* Scanning overlay while processing uploaded file */}
          {isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
              <RefreshCw className="h-8 w-8 animate-spin text-primary/60" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 animate-pulse">
                Scanning Image...
              </span>
            </div>
          )}

          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl pointer-events-none border-dashed border-2 transition-all duration-500 ${
              mode === "ocr"
                ? "w-[80%] h-[40%] border-primary/40"
                : "w-[250px] h-[250px] border-primary/20 animate-pulse"
            }`}
          />

          {mode === "ocr" && isStarted && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4 gap-2">
              <Button
                type="button"
                onClick={handleManualCapture}
                className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-2xl flex items-center justify-center gap-2 group/btn active:scale-95 transition-all text-xs"
              >
                <div className="p-1 rounded bg-white/20 group-hover/btn:scale-110 transition-transform">
                  <Camera className="h-4 w-4" />
                </div>
                SNAP A PIC
              </Button>
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs"
              >
                <Upload className="h-4 w-4" />
                UPLOAD IMG
              </Button>
            </div>
          )}

          {mode === "scan" && isStarted && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center px-6">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="w-full max-w-[220px] h-10 rounded-xl bg-background/80 hover:bg-background/90 text-foreground font-bold shadow-xl backdrop-blur-md flex items-center justify-center gap-2 active:scale-95 transition-all text-xs disabled:opacity-50"
              >
                <Upload className="h-4 w-4 text-primary" />
                {isScanning ? "SCANNING..." : "UPLOAD BARCODE IMG"}
              </Button>
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />

      <p className="text-[10px] text-center text-muted-foreground/60 font-bold uppercase tracking-[0.2em] mt-2 px-4">
        {mode === "ocr"
          ? "Align text markings within the frame and click snap"
          : "Position the code within the frame to auto-capture"}
      </p>
    </div>
  );
}