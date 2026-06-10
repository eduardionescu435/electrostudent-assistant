import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { ProfileModal } from "@/features/auth/components/profile-modal";
import { AppLogo } from "@/components/ui/app-logo";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const user = useAuthStore((state) => state.user);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="lg:hidden" />
            <div className="relative h-8 w-8 hidden sm:flex">
                <AppLogo className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold tracking-tight text-foreground">
                Electro Student Assistant
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Admin Dashboard</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full"
              title="Toggle theme (Press 'd')"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <button
              className="relative transition-all duration-200 hover:opacity-80 cursor-pointer focus:outline-none"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <Avatar className="h-8 w-8 lg:h-9 lg:w-9 border border-border/50 cursor-pointer">
                <AvatarFallback className="bg-muted text-muted-foreground font-medium text-[11px] lg:text-xs">
                  {user ? getInitials(user.username) : "AD"}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </header>
      <ProfileModal open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} />
    </>
  );
}
