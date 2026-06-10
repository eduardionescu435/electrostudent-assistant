import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Lightbulb, Palette, TrendingDown, TrendingUp, ArrowRight } from "lucide-react";

const CALCULATORS = [
  {
    path: "/calculators/ohms-law",
    icon: Zap,
    title: "Ohm's Law",
    description: "Calculate voltage, current, or resistance from any two known values.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "hover:border-yellow-500/30",
  },
  {
    path: "/calculators/power",
    icon: Lightbulb,
    title: "Electrical Power",
    description: "Compute power, voltage, current, or resistance from any two known values.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "hover:border-orange-500/30",
  },
  {
    path: "/calculators/resistor-color-code",
    icon: Palette,
    title: "Resistor Colour Code",
    description: "Decode 4, 5, or 6-band resistor colour codes to resistance and tolerance.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "hover:border-purple-500/30",
  },
  {
    path: "/calculators/rc-lowpass",
    icon: TrendingDown,
    title: "RC Low-Pass Filter",
    description: "Find the cutoff frequency and view the Bode magnitude response chart.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/30",
  },
  {
    path: "/calculators/rc-highpass",
    icon: TrendingUp,
    title: "RC High-Pass Filter",
    description: "Find the cutoff frequency and view the Bode magnitude response chart.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "hover:border-emerald-500/30",
  },
];

export function CalculatorsPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
          Electronic Calculators
        </h1>
        <p className="text-muted-foreground text-sm md:text-base font-medium">
          Professional tools for circuit calculations and component analysis. Select a tool below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CALCULATORS.map(({ path, icon: Icon, title, description, color, bg, border }) => (
          <Card
            key={path}
            onClick={() => navigate(path)}
            className={`group cursor-pointer border border-border/50 bg-background/50 backdrop-blur-sm rounded-2xl transition-all duration-200 hover:shadow-md ${border} hover:-translate-y-0.5`}
          >
            <CardContent className="p-6 flex items-start gap-4">
              <div className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-xl ${bg} transition-transform duration-200 group-hover:scale-110`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-bold text-sm tracking-tight text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              </div>
              <ArrowRight className="shrink-0 h-4 w-4 text-muted-foreground/30 mt-0.5 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all duration-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
