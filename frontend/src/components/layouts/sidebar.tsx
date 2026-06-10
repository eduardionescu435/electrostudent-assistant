import { useNavigate } from "react-router-dom";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/features/auth/api";
import { toast } from "sonner";

export function Sidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      const response = await authApi.logout();

      if (response.error) {
        toast.error(response.error);
        return;
      }

      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("An error occurred during logout");
    }
  };

  return (
    <SidebarPrimitive className="border-r border-sidebar-border bg-sidebar/70 backdrop-blur-xl">
      <SidebarContent className="pt-24 px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest mb-4">
            Management
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<button onClick={() => navigate("/")} />}
                className="h-10 w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 font-medium rounded-lg px-3 group data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground"
                isActive={window.location.pathname === "/"}
              >
                 <div className="flex h-7 w-7 items-center justify-center rounded-md bg-transparent border border-transparent mr-2 shrink-0 transition-all group-hover:border-border/50 group-hover:bg-background/20 group-data-active:border-border/50 group-data-active:bg-background/40">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                    </svg>
                  </div>
                <span className="text-[13px]">Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<button onClick={() => navigate("/inventory")} />}
                className="h-10 w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 font-medium rounded-lg px-3 group data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground"
                isActive={window.location.pathname === "/inventory"}
              >
                 <div className="flex h-7 w-7 items-center justify-center rounded-md bg-transparent border border-transparent mr-2 shrink-0 transition-all group-hover:border-border/50 group-hover:bg-background/20 group-data-active:border-border/50 group-data-active:bg-background/40">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
                      <path d="M3 10h18" />
                      <path d="M7 15h.01" />
                      <path d="M11 15h.01" />
                    </svg>
                  </div>
                <span className="text-[13px]">Inventory</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest mb-4">
            Tools
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<button onClick={() => navigate("/calculators")} />}
                className="h-10 w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 font-medium rounded-lg px-3 group data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground"
                isActive={window.location.pathname.startsWith("/calculators")}
              >
                 <div className="flex h-7 w-7 items-center justify-center rounded-md bg-transparent border border-transparent mr-2 shrink-0 transition-all group-hover:border-border/50 group-hover:bg-background/20 group-data-active:border-border/50 group-data-active:bg-background/40">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="4" y="2" width="16" height="20" rx="2" />
                      <line x1="8" y1="6" x2="16" y2="6" />
                      <line x1="16" y1="14" x2="16" y2="14.01" />
                      <line x1="16" y1="18" x2="16" y2="18.01" />
                      <line x1="12" y1="14" x2="12" y2="14.01" />
                      <line x1="12" y1="18" x2="12" y2="18.01" />
                      <line x1="8" y1="14" x2="8" y2="14.01" />
                      <line x1="8" y1="18" x2="8" y2="18.01" />
                    </svg>
                  </div>
                <span className="text-[13px]">Calculators</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-3 border-t border-border/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full h-10 text-muted-foreground/80 hover:bg-destructive/5 hover:text-destructive font-medium transition-all duration-200 px-3 rounded-lg group"
              onClick={handleLogout}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-transparent mr-2 shrink-0 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
              </div>
              <span className="text-[13px]">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}
