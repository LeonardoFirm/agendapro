"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/components/ui/use-toast";

interface SettingsFormProps {
  children: React.ReactNode;
  onSubmit: () => Promise<{ success: boolean; error?: string }>;
  submitButtonText?: string;
}

export function SettingsForm({
  children,
  onSubmit,
  submitButtonText = "Salvar Alterações",
}: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await onSubmit();

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Configurações salvas com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description:
            result.error || "Ocorreu um erro ao salvar as configurações.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {children}
      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Salvando...
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </form>
  );
}
