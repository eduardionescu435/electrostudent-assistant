import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/features/auth/api";
import { toast } from "sonner";

interface ProfileFormProps {
  onSuccess?: () => void;
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updateData: { username?: string; password?: string } = {};
    if (formData.username.trim()) updateData.username = formData.username.trim();
    if (formData.password.trim()) updateData.password = formData.password.trim();

    if (Object.keys(updateData).length === 0) {
      toast.error("Please provide at least one field to update");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.updateProfile(updateData);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      if (response.data) {
        setUser({ username: response.data.username });
        toast.success("Profile updated successfully");
        setFormData({ username: "", password: "" });
        onSuccess?.();
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-6">
        <div className="rounded-xl bg-muted/30 p-6 border border-border/50">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-xl">
                {user?.username ? user.username.substring(0, 2).toUpperCase() : "AD"}
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-muted-foreground/70 uppercase tracking-wider">Current Account</p>
              <p className="text-2xl font-bold tracking-tight">{user?.username || "Admin"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-2">
          <div className="grid gap-2">
            <Label htmlFor="new-username" className="text-sm font-bold tracking-wide text-foreground/80 flex items-center gap-2 mb-1.5 ml-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary/70"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              New Username
            </Label>
            <Input
              id="new-username"
              type="text"
              placeholder="Leave empty to keep current"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              className="h-12 border-border/60 bg-background/50 focus:bg-background transition-all"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password" className="text-sm font-bold tracking-wide text-foreground/80 flex items-center gap-2 mb-1.5 ml-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary/70"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Leave empty to keep current"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="h-12 border-border/60 bg-background/50 focus:bg-background transition-all"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-12 text-lg font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all cursor-pointer rounded-xl"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
