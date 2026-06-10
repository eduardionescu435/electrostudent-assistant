import { useState } from "react";
import { CalculatorCard } from "./calculator-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

export function PowerCalculator() {
  const [power, setPower] = useState("");
  const [voltage, setVoltage] = useState("");
  const [current, setCurrent] = useState("");
  const [resistance, setResistance] = useState("");
  const [results, setResults] = useState<{ label: string; value: number; unit: string }[]>([]);

  const calculate = () => {
    const P = power ? parseFloat(power) : null;
    const V = voltage ? parseFloat(voltage) : null;
    const I = current ? parseFloat(current) : null;
    const R = resistance ? parseFloat(resistance) : null;

    const inputs = [P, V, I, R].filter(val => val !== null && val > 0);
    
    if (inputs.length < 2) {
      alert("Please enter at least two values");
      return;
    }

    const calculated: { label: string; value: number; unit: string }[] = [];

    let calcP = P, calcV = V, calcI = I, calcR = R;

    if (V !== null && I !== null) {
      if (P === null) calcP = V * I;
      if (R === null) calcR = V / I;
    }
    else if (V !== null && R !== null) {
      if (P === null) calcP = (V * V) / R;
      if (I === null) calcI = V / R;
    }
    else if (I !== null && R !== null) {
      if (P === null) calcP = I * I * R;
      if (V === null) calcV = I * R;
    }
    else if (P !== null && V !== null) {
      if (I === null) calcI = P / V;
      if (R === null) calcR = (V * V) / P;
    }
    else if (P !== null && I !== null) {
      if (V === null) calcV = P / I;
      if (R === null) calcR = P / (I * I);
    }
    else if (P !== null && R !== null) {
      if (V === null) calcV = Math.sqrt(P * R);
      if (I === null) calcI = Math.sqrt(P / R);
    }

    if (calcP !== null && P === null) calculated.push({ label: "Power (P)", value: calcP, unit: "W" });
    if (calcV !== null && V === null) calculated.push({ label: "Voltage (V)", value: calcV, unit: "V" });
    if (calcI !== null && I === null) calculated.push({ label: "Current (I)", value: calcI, unit: "A" });
    if (calcR !== null && R === null) calculated.push({ label: "Resistance (R)", value: calcR, unit: "Ω" });

    setResults(calculated);
  };

  const reset = () => {
    setPower("");
    setVoltage("");
    setCurrent("");
    setResistance("");
    setResults([]);
  };

  return (
    <CalculatorCard
      title="Electrical Power Calculator"
      description="Calculate power, voltage, current, or resistance"
      icon={Lightbulb}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Power (P)
            </label>
            <Input
              type="number"
              placeholder="Watts"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              className="rounded-xl h-11 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Voltage (V)
            </label>
            <Input
              type="number"
              placeholder="Volts"
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
              placeholder="Amperes"
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
              placeholder="Ohms"
              value={resistance}
              onChange={(e) => setResistance(e.target.value)}
              className="rounded-xl h-11 font-medium"
            />
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Results
            </p>
            {results.map((result, index) => (
              <div key={index} className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-muted-foreground">{result.label}:</span>
                  <span className="text-2xl font-black text-primary">{result.value.toFixed(4)}</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-xs font-black">
                    {result.unit}
                  </Badge>
                </div>
              </div>
            ))}
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
          <p className="text-xs font-bold text-muted-foreground mb-2">Formulas:</p>
          <div className="space-y-1 text-xs font-mono text-muted-foreground">
            <p>P = V × I</p>
            <p>P = V² / R</p>
            <p>P = I² × R</p>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
