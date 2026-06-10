import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "../api";
import { toast } from "sonner";

export function RegisterForm() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (credentials.password !== credentials.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (credentials.username.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }

    if (credentials.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        username: credentials.username,
        password: credentials.password,
      });

      if (response.error) {
        toast.error(response.error);
        return;
      }

      if (response.data) {
        setUser({ username: response.data.username });
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Choose a username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, username: e.target.value }))
            }
            required
            autoFocus
            className="h-11"
            minLength={3}
          />
          <p className="text-xs text-muted-foreground">
            At least 3 characters
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            className="h-11"
            minLength={6}
          />
          <p className="text-xs text-muted-foreground">
            At least 6 characters
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={credentials.confirmPassword}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
            required
            className="h-11"
            minLength={6}
          />
        </div>
      </div>
      <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
