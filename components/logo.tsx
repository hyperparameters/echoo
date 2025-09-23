import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "white" | "icon" | "icon-white";
  className?: string;
  width?: number;
  height?: number;
}

const logoVariants = {
  default: "/echoo-logo-sm.png",
  white: "/echoo-logo-white-sm.png",
  icon: "/echoo-xs.png",
  "icon-white": "/echoo-white-xs.png",
};

export function Logo({
  variant = "default",
  className,
  width = 40,
  height = 40,
}: LogoProps) {
  const logoSrc = logoVariants[variant];

  return (
    <Image
      src={logoSrc}
      alt="Echoo Logo"
      width={width}
      height={height}
      className={cn("object-contain", className)}
      priority
    />
  );
}
