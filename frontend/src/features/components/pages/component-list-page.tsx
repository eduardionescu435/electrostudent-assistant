import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useComponentStore, type Component } from "@/store/component-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Loader2, Package, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { AddComponentModal } from "../components/add-component-modal";
import { EditComponentModal } from "../components/edit-component-modal";
import { toast } from "sonner";

export function ComponentListPage() {
  const { components, pagination, isLoading, fetchComponents, deleteComponent } = useComponentStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const searchTerm = searchParams.get("search") ?? "";
  const categoryFilter = searchParams.get("category") ?? "all";

  const [localSearch, setLocalSearch] = useState(searchTerm);

  const setPage = useCallback((updater: number | ((prev: number) => number)) => {
    const next = typeof updater === "function" ? updater(page) : updater;
    setSearchParams(prev => { prev.set("page", String(next)); return prev; }, { replace: true });
  }, [page, setSearchParams]);

  const setCategoryFilter = useCallback((val: string) => {
    setSearchParams(prev => {
      prev.set("category", val);
      prev.set("page", "1");
      return prev;
    }, { replace: true });
  }, [setSearchParams]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);

  useEffect(() => {
    setLocalSearch(searchTerm);
    fetchComponents(searchTerm, categoryFilter === "all" ? "" : categoryFilter, page);
  }, [fetchComponents, searchTerm, categoryFilter, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      prev.set("search", localSearch);
      prev.set("page", "1");
      return prev;
    }, { replace: true });
  };

  const handleEdit = (component: Component) => {
    setSelectedComponent(component);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (component: Component) => {
    if (window.confirm(`Are you sure you want to delete ${component.name}?`)) {
      try {
        await deleteComponent(component.id);
        toast.success("Component deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete component");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage your electronic components collection.</p>
        </div>
        <Button className="w-full md:w-auto gap-2 h-11 px-6 rounded-lg font-bold" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Component
        </Button>
      </div>

      <AddComponentModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

      <EditComponentModal
        component={selectedComponent}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />

      <Card className="border-border/40 shadow-sm overflow-hidden rounded-xl">
        <CardHeader className="pb-3 bg-muted/20 border-b border-border/40">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, manufacturer, or code..."
                className="pl-9 h-10 rounded-lg bg-background border-border/50"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </form>
            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || "all")}>
                <SelectTrigger className="w-[140px] h-10 rounded-lg border-border/50 bg-background text-xs font-medium">
                  <Filter className="h-3.5 w-3.5 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
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
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow className="hover:bg-transparent border-border/40">
                  <TableHead className="w-[80px] pl-6 py-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Icon</TableHead>
                  <TableHead className="py-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Name</TableHead>
                  <TableHead className="py-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Category</TableHead>
                  <TableHead className="py-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Qty</TableHead>
                  <TableHead className="py-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Manufacturer</TableHead>
                  <TableHead className="py-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Code</TableHead>
                  <TableHead className="text-right pr-6 py-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (!components || components.length === 0) ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                        <span className="text-sm font-medium">Syncing inventory database...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (!components || components.length === 0) ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/50">
                        <Package className="h-12 w-12 stroke-1" />
                        <span className="text-sm font-medium tracking-tight">Your component collection is empty.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  components.map((component) => (
                    <TableRow
                      key={component.id}
                      className="group transition-colors border-border/20"
                    >
                      <TableCell className="pl-6 py-4">
                        <Link to={`/inventory/${component.id}`}>
                          <div className="h-11 w-11 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden border border-border/10 group-hover:border-border/50 transition-all duration-300">
                            {component.image_url ? (
                              <img src={component.image_url} alt={component.name} className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-5 w-5 text-muted-foreground/30 group-hover:scale-110 group-hover:text-primary/40 transition-all duration-300" />
                            )}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="py-4 text-[14px] font-bold tracking-tight text-foreground hover:text-primary transition-colors">
                        <Link to={`/inventory/${component.id}`}>
                          {component.name}
                        </Link>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="secondary" className="font-medium px-2.5 py-0.5 rounded-full bg-muted border-none text-[11px] text-muted-foreground/70">
                          {component.category || "General"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${component.quantity > 5 ? 'bg-emerald-500' : 'bg-destructive animate-pulse'}`} />
                          <span className={`text-[13px] font-bold ${component.quantity > 5 ? "text-foreground" : "text-destructive"}`}>
                            {component.quantity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium text-[13px] py-4">
                        {component.manufacturer || "—"}
                      </TableCell>
                      <TableCell className="font-mono text-[11px] font-semibold text-muted-foreground py-4">
                        {component.identification_code || "—"}
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md transition-all hover:bg-muted hover:text-primary"
                            onClick={() => handleEdit(component)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md transition-all hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(component)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/5">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Page {pagination.page} of {pagination.total_pages} • {pagination.total} items
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-md gap-1 font-bold text-xs"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-md gap-1 font-bold text-xs"
                onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
                disabled={pagination.page >= pagination.total_pages}
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

