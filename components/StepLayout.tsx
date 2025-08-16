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
    <Card className="mx-auto w-full max-w-2xl rounded-2xl transition-shadow hover:shadow-lg dark:hover:shadow-white/10">
      <CardHeader className="text-center">
        <div className="bg-accent/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
          <Icon className="text-accent h-6 w-6" />
        </div>
        <CardTitle className="font-serif text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  );
}
