import { useState } from "react";
import { CalculatorCard } from "./calculator-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Palette } from "lucide-react";

const COLOR_VALUES: { [key: string]: number } = {
  "Black": 0, "Brown": 1, "Red": 2, "Orange": 3, "Yellow": 4,
  "Green": 5, "Blue": 6, "Violet": 7, "Grey": 8, "White": 9
};

const MULTIPLIERS: { [key: string]: number } = {
  "Black": 1, "Brown": 10, "Red": 100, "Orange": 1000, "Yellow": 10000,
  "Green": 100000, "Blue": 1000000, "Violet": 10000000, "Gold": 0.1, "Silver": 0.01
};

const TOLERANCE: { [key: string]: number } = {
  "Brown": 1, "Red": 2, "Green": 0.5, "Blue": 0.25,
  "Violet": 0.1, "Grey": 0.05, "Gold": 5, "Silver": 10, "None": 20
};

const COLOR_HEX: { [key: string]: string } = {
  "Black": "#000000", "Brown": "#8B4513", "Red": "#FF0000", "Orange": "#FFA500",
  "Yellow": "#FFFF00", "Green": "#008000", "Blue": "#0000FF", "Violet": "#9400D3",
  "Grey": "#808080", "White": "#FFFFFF", "Gold": "#FFD700", "Silver": "#C0C0C0"
};

export function ResistorColorCode() {
  const [bands, setBands] = useState(4);
  const [band1, setBand1] = useState("");
  const [band2, setBand2] = useState("");
  const [band3, setBand3] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [tolerance, setTolerance] = useState("");

  const calculateResistance = () => {
    if (bands === 4) {
      if (!band1 || !band2 || !multiplier) return null;
      const value = (COLOR_VALUES[band1] * 10 + COLOR_VALUES[band2]) * MULTIPLIERS[multiplier];
      return value;
    } else if (bands === 5 || bands === 6) {
      if (!band1 || !band2 || !band3 || !multiplier) return null;
      const value = (COLOR_VALUES[band1] * 100 + COLOR_VALUES[band2] * 10 + COLOR_VALUES[band3]) * MULTIPLIERS[multiplier];
      return value;
    }
    return null;
  };

  const formatResistance = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)} MΩ`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)} kΩ`;
    return `${value.toFixed(2)} Ω`;
  };

  const resistance = calculateResistance();
  const toleranceValue = tolerance ? TOLERANCE[tolerance] : null;

  return (
    <CalculatorCard
      title="Resistor Colour Code Decoder"
      description="Decode resistor values from color bands"
      icon={Palette}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            Number of Bands
          </label>
          <Select value={bands.toString()} onValueChange={(val) => val && setBands(parseInt(val))}>
            <SelectTrigger className="rounded-xl h-11 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4 Bands</SelectItem>
              <SelectItem value="5">5 Bands</SelectItem>
              <SelectItem value="6">6 Bands</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Visual Resistor */}
        <div className="p-6 rounded-2xl bg-muted/10 border border-border/50">
          <div className="flex items-center justify-center gap-1">
            <div className="h-16 w-8 bg-gradient-to-r from-muted to-muted/50 rounded-l-full" />
            <div className="flex gap-2">
              <div className="h-16 w-8 rounded-md border-2 border-border" style={{ backgroundColor: band1 ? COLOR_HEX[band1] : "#e5e7eb" }} />
              <div className="h-16 w-8 rounded-md border-2 border-border" style={{ backgroundColor: band2 ? COLOR_HEX[band2] : "#e5e7eb" }} />
              {(bands === 5 || bands === 6) && (
                <div className="h-16 w-8 rounded-md border-2 border-border" style={{ backgroundColor: band3 ? COLOR_HEX[band3] : "#e5e7eb" }} />
              )}
              <div className="h-16 w-8 rounded-md border-2 border-border" style={{ backgroundColor: multiplier ? COLOR_HEX[multiplier] : "#e5e7eb" }} />
              <div className="h-16 w-8 rounded-md border-2 border-border" style={{ backgroundColor: tolerance ? COLOR_HEX[tolerance] : "#e5e7eb" }} />
            </div>
            <div className="h-16 w-8 bg-gradient-to-l from-muted to-muted/50 rounded-r-full" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Band 1 (1st Digit)
            </label>
            <Select value={band1} onValueChange={(val) => val && setBand1(val)}>
              <SelectTrigger className="rounded-xl h-11 font-medium">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(COLOR_VALUES).map((color) => (
                  <SelectItem key={color} value={color}>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded border" style={{ backgroundColor: COLOR_HEX[color] }} />
                      {color}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Band 2 (2nd Digit)
            </label>
            <Select value={band2} onValueChange={(val) => val && setBand2(val)}>
              <SelectTrigger className="rounded-xl h-11 font-medium">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(COLOR_VALUES).map((color) => (
                  <SelectItem key={color} value={color}>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded border" style={{ backgroundColor: COLOR_HEX[color] }} />
                      {color}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(bands === 5 || bands === 6) && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                Band 3 (3rd Digit)
              </label>
              <Select value={band3} onValueChange={(val) => val && setBand3(val)}>
                <SelectTrigger className="rounded-xl h-11 font-medium">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(COLOR_VALUES).map((color) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded border" style={{ backgroundColor: COLOR_HEX[color] }} />
                        {color}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Multiplier
            </label>
            <Select value={multiplier} onValueChange={(val) => val && setMultiplier(val)}>
              <SelectTrigger className="rounded-xl h-11 font-medium">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(MULTIPLIERS).map((color) => (
                  <SelectItem key={color} value={color}>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded border" style={{ backgroundColor: COLOR_HEX[color] }} />
                      {color}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Tolerance
            </label>
            <Select value={tolerance} onValueChange={(val) => val && setTolerance(val)}>
              <SelectTrigger className="rounded-xl h-11 font-medium">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(TOLERANCE).map((color) => (
                  <SelectItem key={color} value={color}>
                    <div className="flex items-center gap-2">
                      {color !== "None" && <div className="h-4 w-4 rounded border" style={{ backgroundColor: COLOR_HEX[color] }} />}
                      {color} ({TOLERANCE[color]}%)
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {resistance !== null && (
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
              Resistance Value
            </p>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-black text-primary">{formatResistance(resistance)}</span>
              {toleranceValue !== null && (
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-none text-xs font-black">
                  ±{toleranceValue}%
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
