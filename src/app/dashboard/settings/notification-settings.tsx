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
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/components/ui/use-toast";
import {
  getEmailTemplates,
  getNotificationSettings,
  updateEmailTemplates,
  updateNotificationSettings,
} from "./actions";

const defaultNotifications = [
  {
    id: "new-appointment",
    notificationType: "new-appointment",
    label: "Novo agendamento",
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
  },
  {
    id: "appointment-reminder-24h",
    notificationType: "appointment-reminder-24h",
    label: "Lembrete de agendamento (24h antes)",
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
  },
  {
    id: "appointment-reminder-1h",
    notificationType: "appointment-reminder-1h",
    label: "Lembrete de agendamento (1h antes)",
    emailEnabled: false,
    smsEnabled: true,
    pushEnabled: true,
  },
  {
    id: "appointment-cancelled",
    notificationType: "appointment-cancelled",
    label: "Agendamento cancelado",
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
  },
  {
    id: "appointment-modified",
    notificationType: "appointment-modified",
    label: "Agendamento modificado",
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
  },
  {
    id: "payment-received",
    notificationType: "payment-received",
    label: "Pagamento recebido",
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
  },
];

export function NotificationSettings() {
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] =
    useState(defaultNotifications);
  const [emailTemplates, setEmailTemplates] = useState({
    confirmationTemplate: "",
    reminderTemplate: "",
    cancellationTemplate: "",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load notification settings
        const notificationData = await getNotificationSettings();
        if (notificationData && notificationData.length > 0) {
          const updatedSettings = defaultNotifications.map((defaultNotif) => {
            const savedNotif = notificationData.find(
              (notif) =>
                notif.notification_type === defaultNotif.notificationType,
            );
            if (savedNotif) {
              return {
                ...defaultNotif,
                emailEnabled: savedNotif.email_enabled,
                smsEnabled: savedNotif.sms_enabled,
                pushEnabled: savedNotif.push_enabled,
              };
            }
            return defaultNotif;
          });
          setNotificationSettings(updatedSettings);
        }

        // Load email templates
        const templateData = await getEmailTemplates();
        if (templateData && templateData.length > 0) {
          const templates = {
            confirmationTemplate: "",
            reminderTemplate: "",
            cancellationTemplate: "",
          };

          templateData.forEach((template) => {
            if (template.template_type === "confirmation") {
              templates.confirmationTemplate = template.template_content || "";
            } else if (template.template_type === "reminder") {
              templates.reminderTemplate = template.template_content || "";
            } else if (template.template_type === "cancellation") {
              templates.cancellationTemplate = template.template_content || "";
            }
          });

          setEmailTemplates(templates);
        }
      } catch (error) {
        console.error("Error loading notification settings:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleNotificationChange = (
    id: string,
    field: "emailEnabled" | "smsEnabled" | "pushEnabled",
    checked: boolean,
  ) => {
    setNotificationSettings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: checked } : item,
      ),
    );
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEmailTemplates((prev) => ({
      ...prev,
      [id.replace("-template", "Template")]: value,
    }));
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNotificationLoading(true);

    try {
      const result = await updateNotificationSettings(notificationSettings);

      if (result.success) {
        toast({
          title: "Preferências salvas",
          description:
            "Suas preferências de notificação foram salvas com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description:
            result.error ||
            "Ocorreu um erro ao salvar as preferências de notificação.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao salvar as preferências de notificação.",
        variant: "destructive",
      });
    } finally {
      setIsNotificationLoading(false);
    }
  };

  const handleTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTemplateLoading(true);

    try {
      const result = await updateEmailTemplates(emailTemplates);

      if (result.success) {
        toast({
          title: "Modelos salvos",
          description: "Seus modelos de email foram salvos com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description:
            result.error || "Ocorreu um erro ao salvar os modelos de email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os modelos de email.",
        variant: "destructive",
      });
    } finally {
      setIsTemplateLoading(false);
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Notificações</CardTitle>
          <CardDescription>
            Configure como você deseja receber notificações
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleNotificationSubmit}>
          <CardContent>
            <div className="space-y-4">
              {notificationSettings.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border-b last:border-0"
                >
                  <div className="font-medium">{item.label}</div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`${item.id}-email`}
                        checked={item.emailEnabled}
                        onCheckedChange={(checked) =>
                          handleNotificationChange(
                            item.id,
                            "emailEnabled",
                            !!checked,
                          )
                        }
                      />
                      <Label htmlFor={`${item.id}-email`}>Email</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`${item.id}-sms`}
                        checked={item.smsEnabled}
                        onCheckedChange={(checked) =>
                          handleNotificationChange(
                            item.id,
                            "smsEnabled",
                            !!checked,
                          )
                        }
                      />
                      <Label htmlFor={`${item.id}-sms`}>SMS</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`${item.id}-push`}
                        checked={item.pushEnabled}
                        onCheckedChange={(checked) =>
                          handleNotificationChange(
                            item.id,
                            "pushEnabled",
                            !!checked,
                          )
                        }
                      />
                      <Label htmlFor={`${item.id}-push`}>
                        Notificação Push
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isNotificationLoading}>
              {isNotificationLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Salvando...
                </>
              ) : (
                "Salvar Preferências"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modelos de Email</CardTitle>
          <CardDescription>
            Personalize os modelos de email enviados aos clientes
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleTemplateSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirmation-template">
                Email de Confirmação
              </Label>
              <Input
                id="confirmation-template"
                placeholder="Modelo de email de confirmação"
                value={emailTemplates.confirmationTemplate}
                onChange={handleTemplateChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-template">Email de Lembrete</Label>
              <Input
                id="reminder-template"
                placeholder="Modelo de email de lembrete"
                value={emailTemplates.reminderTemplate}
                onChange={handleTemplateChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancellation-template">
                Email de Cancelamento
              </Label>
              <Input
                id="cancellation-template"
                placeholder="Modelo de email de cancelamento"
                value={emailTemplates.cancellationTemplate}
                onChange={handleTemplateChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isTemplateLoading}>
              {isTemplateLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Salvando...
                </>
              ) : (
                "Salvar Modelos"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
