import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-background">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
