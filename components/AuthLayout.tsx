"use client";

import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { user } = useAuth();

  // Pages that should not show the navbar
  const shouldShowNavItems = user ? true : false;

  return (
    <div className="from-background via-background/95 to-primary/5 min-h-screen bg-gradient-to-br">
      <Navbar showNavItems={shouldShowNavItems} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
