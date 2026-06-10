import { Outlet } from "react-router-dom";
import { Header } from "@/components/layouts/header";
import { Sidebar } from "@/components/layouts/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-svh w-full flex-col bg-background relative overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden relative z-10">
          <Sidebar />
          <SidebarInset className="flex-1 relative bg-transparent overflow-x-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -right-24 w-125 h-125 bg-primary/3 rounded-full blur-[120px]" />
            </div>

            <div className="container max-w-7xl mx-auto p-6 md:p-8 lg:p-10 relative z-10">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
