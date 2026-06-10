import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "../components/register-form";
import { AppLogo } from "@/components/ui/app-logo";
import { Link } from "react-router-dom";

export function RegisterPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-6">
      {/* Soft, simplified background effects to prevent banding lines */}
      <div className="absolute inset-0 bg-primary/2 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <Card className="shadow-2xl border-border/10 bg-card overflow-hidden">
          <CardHeader className="space-y-4 pb-6 pt-10">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center">
                <AppLogo className="w-full h-full" />
              </div>
              <div className="text-center space-y-2 mt-6">
                <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Create Account</CardTitle>
                <CardDescription className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  Electro Student Assistant
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-10 px-8">
            <RegisterForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="font-medium text-primary hover:underline underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-[11px] text-muted-foreground/60 mt-8 font-medium uppercase tracking-[0.2em]">
          Secure Authentication System
        </p>
      </div>
    </div>
  );
}
