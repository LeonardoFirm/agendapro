"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/components/ui/use-toast";
import { getBusinessSettings, updateBusinessInfo } from "./actions";

export function BusinessSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [businessData, setBusinessData] = useState({
    businessName: "",
    businessType: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
  });

  useEffect(() => {
    const loadBusinessSettings = async () => {
      try {
        const settings = await getBusinessSettings();
        if (settings) {
          setBusinessData({
            businessName: settings.business_name || "",
            businessType: settings.business_type || "",
            businessAddress: settings.business_address || "",
            businessPhone: settings.business_phone || "",
            businessEmail: settings.business_email || "",
          });
        }
      } catch (error) {
        console.error("Error loading business settings:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadBusinessSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setBusinessData((prev) => ({
      ...prev,
      [id.replace("business-", "")]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateBusinessInfo(businessData);

      if (result.success) {
        toast({
          title: "Informações salvas",
          description:
            "As informações do seu negócio foram salvas com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description:
            result.error ||
            "Ocorreu um erro ao salvar as informações do negócio.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as informações do negócio.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Negócio</CardTitle>
        <CardDescription>
          Configure as informações do seu negócio
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Nome do Negócio</Label>
              <Input
                id="business-name"
                placeholder="Nome da sua empresa"
                value={businessData.businessName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-type">Tipo de Negócio</Label>
              <Input
                id="business-type"
                placeholder="Ex: Salão de Beleza, Barbearia, etc"
                value={businessData.businessType}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="business-address">Endereço</Label>
              <Input
                id="business-address"
                placeholder="Endereço completo"
                value={businessData.businessAddress}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-phone">Telefone Comercial</Label>
              <Input
                id="business-phone"
                placeholder="(00) 00000-0000"
                value={businessData.businessPhone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-email">Email Comercial</Label>
              <Input
                id="business-email"
                type="email"
                placeholder="contato@seudominio.com"
                value={businessData.businessEmail}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Salvando...
              </>
            ) : (
              "Salvar Informações"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
