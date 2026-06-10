import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
  iconClassName?: string;
}

export function AppLogo({ className, iconClassName }: AppLogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center shrink-0", className)}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-full h-full", iconClassName)}
      >
        {/* The Circle Background: Automatically matches current primary theme */}
        <circle cx="32" cy="32" r="32" className="fill-primary" />
        
        {/* Subtle Shadow effect for depth */}
        <path
          d="M46.9,17.5C46.7,17.2,46.4,17,46,17H29c-0.4,0-0.7,0.2-0.9,0.6l-8,16c-0.2,0.3-0.1,0.7,0,1
          c0.2,0.3,0.5,0.5,0.9,0.5h5.5l-8.4,18.6c-0.2,0.4-0.1,0.9,0.3,1.2c0.2,0.1,0.4,0.2,0.6,0.2c0.2,0,0.5-0.1,0.6-0.2l24-20
          c0.3-0.3,0.4-0.7,0.3-1.1C43.8,33.3,43.4,33,43,33h-6.1l9.9-14.4C47,18.3,47.1,17.9,46.9,17.5z"
          className="fill-black opacity-20"
        />
        
        {/* The Lightning Bolt: Matches the current background color for hollow/inverted feel, or a pop color */}
        <path
          d="M46.9,15.5C46.7,15.2,46.4,15,46,15H29c-0.4,0-0.7,0.2-0.9,0.6l-8,16c-0.2,0.3-0.1,0.7,0,1
          c0.2,0.3,0.5,0.5,0.9,0.5h5.5l-8.4,18.6c-0.2,0.4-0.1,0.9,0.3,1.2c0.2,0.1,0.4,0.2,0.6,0.2c0.2,0,0.5-0.1,0.6-0.2l24-20
          c0.3-0.3,0.4-0.7,0.3-1.1C43.8,31.3,43.4,31,43,31h-6.1l9.9-14.4C47,16.3,47.1,15.9,46.9,15.5z"
          className="fill-background"
        />
      </svg>
    </div>
  );
}
