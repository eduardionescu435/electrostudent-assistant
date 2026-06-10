import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RCLowPassCalculator } from "../components/rc-lowpass-calculator";

export function RCLowPassPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button
        variant="ghost"
        className="group w-fit h-8 px-4 text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => navigate("/calculators")}
      >
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Calculators
      </Button>
      <RCLowPassCalculator />
    </div>
  );
}
