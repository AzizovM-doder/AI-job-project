import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}
