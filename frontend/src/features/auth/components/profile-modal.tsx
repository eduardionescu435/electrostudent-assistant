import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileForm } from "@/features/auth/components/profile-form";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border/50 shadow-2xl">
        {/* Subtle Background Effects */}
        <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 inset-x-0 bg-linear-to-b from-primary/5 via-transparent to-transparent h-32 pointer-events-none" />

        <div className="relative w-full p-8 md:p-10">
          <DialogHeader className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative flex items-center justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-card shadow-sm border border-border/50">
                <img src="/icon.svg" alt="Logo" className="w-9 h-9" />
              </div>
            </div>
            
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold tracking-tight">
                Account Settings
              </DialogTitle>
              <DialogDescription className="text-base font-medium text-muted-foreground/80">
                Manage your credentials and preferences
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="mt-10">
            <ProfileForm onSuccess={() => onOpenChange(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
