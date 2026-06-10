import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Package, 
  AlertTriangle, 
  FileText, 
  Layers,
  Activity,
  ArrowRight,
  TrendingUp,
  ChartPie
} from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  type ChartConfig 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  total_components: number;
  low_stock: number;
  datasheets_count: number;
  categories_stats: { name: string; value: number }[];
}

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const barChartConfig = {
  value: {
    label: "Quantity",
    color: "#818cf8",
  },
} satisfies ChartConfig;

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/components/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted/20 rounded-2xl border border-border/50" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-muted/20 rounded-2xl border border-border/50" />
          <div className="h-80 bg-muted/20 rounded-2xl border border-border/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Inventory Overview</h1>
          <p className="text-muted-foreground font-medium">Real-time stats from your component library.</p>
        </div>
        <Button 
          className="rounded-xl h-12 px-6 gap-2 font-bold shadow-lg shadow-primary/20 group"
          onClick={() => navigate("/inventory")}
        >
          Manage Inventory
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dark:bg-zinc-950/40 bg-white/40 border-border/20 shadow-xl rounded-3xl overflow-hidden group hover:border-primary/40 transition-all duration-500 backdrop-blur-md">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Total Components</CardTitle>
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-inner">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-5xl font-black tracking-tighter">{stats?.total_components || 0}</div>
            <p className="text-[11px] text-muted-foreground mt-3 font-bold flex items-center gap-1.5 opacity-60">
              <Activity className="h-3 w-3 text-emerald-400" />
              Items cataloged
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-950/40 bg-white/40 border-border/20 shadow-xl rounded-3xl overflow-hidden group hover:border-amber-500/40 transition-all duration-500 backdrop-blur-md">
          <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Low Stock Alert</CardTitle>
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-inner ${stats?.low_stock && stats.low_stock > 0 ? 'bg-amber-500/10 group-hover:bg-amber-500/20' : 'bg-emerald-500/10'}`}>
              <AlertTriangle className={`h-5 w-5 ${stats?.low_stock && stats.low_stock > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-5xl font-black tracking-tighter ${stats?.low_stock && stats.low_stock > 0 ? 'text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'text-foreground'}`}>
              {stats?.low_stock || 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 font-bold opacity-60">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-950/40 bg-white/40 border-border/20 shadow-xl rounded-3xl overflow-hidden group hover:border-blue-500/40 transition-all duration-500 backdrop-blur-md">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Documentation</CardTitle>
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500 shadow-inner">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-5xl font-black tracking-tighter">{stats?.datasheets_count || 0}</div>
            <p className="text-[11px] text-muted-foreground mt-3 font-bold opacity-60">Verified datasheets</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Bar Chart */}
        <Card className="lg:col-span-12 border-border/40 shadow-sm rounded-2xl">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  Category Distribution
                </CardTitle>
                <CardDescription className="text-xs mt-1 font-bold opacity-40 uppercase tracking-widest pl-11">Inventory levels by type</CardDescription>
              </div>
              <Activity className="h-4 w-4 text-muted-foreground/20" />
            </div>
          </CardHeader>
          <CardContent className="pt-10">
            <ChartContainer config={barChartConfig} className="aspect-auto h-[300px]">
              <BarChart accessibilityLayer data={stats?.categories_stats || []} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid vertical={false} strokeDasharray="8 8" stroke="hsl(var(--border))" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tickMargin={10}
                  tick={{ fill: '#888', fontSize: 12, fontWeight: 500 }} 
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar 
                  dataKey="value" 
                  fill="var(--color-value)"
                  radius={4} 
                  barSize={45}
                  minPointSize={10}
                  className="hover:brightness-125 transition-all cursor-pointer"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm border-t border-border/10 py-4 dark:bg-zinc-950/20 bg-white/10">
            <div className="flex gap-2 leading-none font-bold text-muted-foreground/80">
              Inventory distribution by component category <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="leading-none text-[10px] text-muted-foreground/40 uppercase tracking-widest font-black">
              Showing counts across {stats?.categories_stats.length || 0} categories
            </div>
          </CardFooter>
        </Card>

        {/* Categories Pie Chart - Optional Row below if needed, but Bar is better for categories */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="dark:bg-zinc-950/40 bg-white/40 border-border/20 shadow-xl rounded-3xl overflow-hidden backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ChartPie className="h-4 w-4 text-primary" />
              </div>
              Category Breakdown
            </CardTitle>
            <CardDescription className="text-xs mt-1 font-bold opacity-40 uppercase tracking-widest pl-11">Percentage distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.categories_stats || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats?.categories_stats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="hsl(var(--card))" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(20px)'
                  }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px', paddingTop: '20px', opacity: 0.6 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-950/40 bg-white/40 border-border/20 shadow-xl rounded-3xl overflow-hidden backdrop-blur-md flex flex-col items-center justify-center text-center p-8 gap-6">
          <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center shadow-inner group">
            <Activity className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tighter">System Health</h3>
            <p className="text-muted-foreground text-xs font-bold opacity-60 max-w-[250px]">All systems are operational. Your laboratory database is synced.</p>
          </div>
          <Button variant="outline" className="rounded-xl font-bold" onClick={() => navigate("/inventory")}>
            Check Alerts
          </Button>
        </Card>
      </div>
    </div>
  );
}
