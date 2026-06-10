import { useState } from "react";
import { CalculatorCard } from "./calculator-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function RCLowPassCalculator() {
  const [resistance, setResistance] = useState("");
  const [resistanceUnit, setResistanceUnit] = useState("1000");
  const [capacitance, setCapacitance] = useState("");
  const [capacitanceUnit, setCapacitanceUnit] = useState("1e-6");
  const [cutoffFreq, setCutoffFreq] = useState<number | null>(null);
  const [chartData, setChartData] = useState<{ freq: number; magnitude: number }[]>([]);

  const calculate = () => {
    const R = parseFloat(resistance) * parseFloat(resistanceUnit);
    const C = parseFloat(capacitance) * parseFloat(capacitanceUnit);

    if (!R || !C || R <= 0 || C <= 0) {
      alert("Please enter valid positive values");
      return;
    }

    const fc = 1 / (2 * Math.PI * R * C);
    setCutoffFreq(fc);

    const data = [];
    const startFreq = fc / 100;
    const endFreq = fc * 100;
    const steps = 100;

    for (let i = 0; i <= steps; i++) {
      const freq = startFreq * Math.pow(endFreq / startFreq, i / steps);
      const normalizedFreq = freq / fc;
      const magnitude = 1 / Math.sqrt(1 + normalizedFreq * normalizedFreq);
      const magnitudeDB = 20 * Math.log10(magnitude);
      
      data.push({ freq, magnitude: magnitudeDB });
    }

    setChartData(data);
  };

  const reset = () => {
    setResistance("");
    setCapacitance("");
    setCutoffFreq(null);
    setChartData([]);
  };

  const formatFrequency = (freq: number) => {
    if (freq >= 1000000) return `${(freq / 1000000).toFixed(2)} MHz`;
    if (freq >= 1000) return `${(freq / 1000).toFixed(2)} kHz`;
    return `${freq.toFixed(2)} Hz`;
  };

  return (
    <CalculatorCard
      title="RC Low-Pass Filter Analyser"
      description="Calculate cutoff frequency and view frequency response"
      icon={TrendingDown}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Resistance (R)
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Value"
                value={resistance}
                onChange={(e) => setResistance(e.target.value)}
                className="rounded-xl h-11 font-medium flex-1"
              />
              <Select value={resistanceUnit} onValueChange={(val) => val && setResistanceUnit(val)}>
                <SelectTrigger className="rounded-xl h-11 font-medium w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ω</SelectItem>
                  <SelectItem value="1000">kΩ</SelectItem>
                  <SelectItem value="1000000">MΩ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Capacitance (C)
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Value"
                value={capacitance}
                onChange={(e) => setCapacitance(e.target.value)}
                className="rounded-xl h-11 font-medium flex-1"
              />
              <Select value={capacitanceUnit} onValueChange={(val) => val && setCapacitanceUnit(val)}>
                <SelectTrigger className="rounded-xl h-11 font-medium w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1e-12">pF</SelectItem>
                  <SelectItem value="1e-9">nF</SelectItem>
                  <SelectItem value="1e-6">µF</SelectItem>
                  <SelectItem value="1e-3">mF</SelectItem>
                  <SelectItem value="1">F</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {cutoffFreq !== null && (
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
              Cutoff Frequency (fc)
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary">{formatFrequency(cutoffFreq)}</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-xs font-black">
                -3dB Point
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

        {chartData.length > 0 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Frequency Response (Bode Plot)
            </p>
            <div className="p-4 rounded-2xl bg-muted/10 border border-border/50">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="freq"
                    scale="log"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value) => formatFrequency(value)}
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Frequency', position: 'insideBottom', offset: -5, fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Magnitude (dB)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value.toFixed(2)} dB`, 'Magnitude']}
                    labelFormatter={(value) => `Frequency: ${formatFrequency(value as number)}`}
                  />
                  <Line type="monotone" dataKey="magnitude" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
          <p className="text-xs font-bold text-muted-foreground mb-2">Formula:</p>
          <div className="space-y-1 text-xs font-mono text-muted-foreground">
            <p>fc = 1 / (2π × R × C)</p>
            <p>|H(f)| = 1 / √(1 + (f/fc)²)</p>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
