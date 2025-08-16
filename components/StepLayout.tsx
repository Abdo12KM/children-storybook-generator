import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StepLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}

export function StepLayout({
  title,
  description,
  icon: Icon,
  children,
}: StepLayoutProps) {
  return (
    <Card className="w-full hover:shadow-lg dark:hover:shadow-white/10 transition-shadow rounded-2xl max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-accent" />
        </div>
        <CardTitle className="text-2xl font-serif">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  );
}
