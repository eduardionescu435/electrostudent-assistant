import { useState } from "react";
import { CalculatorCard } from "./calculator-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export function OhmsLawCalculator() {
  const [voltage, setVoltage] = useState("");
  const [current, setCurrent] = useState("");
  const [resistance, setResistance] = useState("");
  const [result, setResult] = useState<{ type: string; value: number } | null>(null);

  const calculate = () => {
    const V = voltage ? parseFloat(voltage) : null;
    const I = current ? parseFloat(current) : null;
    const R = resistance ? parseFloat(resistance) : null;

    const filledCount = [V, I, R].filter(val => val !== null && val > 0).length;

    if (filledCount !== 2) {
      alert("Please enter exactly two values");
      return;
    }

    if (V !== null && I !== null) {
      setResult({ type: "Resistance (R)", value: V / I });
      setResistance("");
    } else if (V !== null && R !== null) {
      setResult({ type: "Current (I)", value: V / R });
      setCurrent("");
    } else if (I !== null && R !== null) {
      setResult({ type: "Voltage (V)", value: I * R });
      setVoltage("");
    }
  };

  const reset = () => {
    setVoltage("");
    setCurrent("");
    setResistance("");
    setResult(null);
  };

  return (
    <CalculatorCard
      title="Ohm's Law Calculator"
      description="Calculate voltage, current, or resistance"
      icon={Zap}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Voltage (V)
            </label>
            <Input
              type="number"
              placeholder="Enter voltage in volts"
              value={voltage}
              onChange={(e) => setVoltage(e.target.value)}
              className="rounded-xl h-11 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Current (I)
            </label>
            <Input
              type="number"
              placeholder="Enter current in amperes"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="rounded-xl h-11 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Resistance (R)
            </label>
            <Input
              type="number"
              placeholder="Enter resistance in ohms"
              value={resistance}
              onChange={(e) => setResistance(e.target.value)}
              className="rounded-xl h-11 font-medium"
            />
          </div>
        </div>

        {result && (
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
              Result
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-muted-foreground">{result.type}:</span>
              <span className="text-2xl font-black text-primary">{result.value.toFixed(4)}</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-xs font-black">
                {result.type.includes("V") ? "V" : result.type.includes("I") ? "A" : "Ω"}
              </Badge>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={calculate} className="flex-1 rounded-xl h-11 font-bold">
            Calculate
          </Button>
          <Button onClick={reset} variant="outline" className="rounded-xl h-11 font-bold">
            Reset
          </Button>
        </div>

        <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
          <p className="text-xs font-bold text-muted-foreground mb-2">Formula:</p>
          <div className="space-y-1 text-xs font-mono text-muted-foreground">
            <p>V = I × R</p>
            <p>I = V / R</p>
            <p>R = V / I</p>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
