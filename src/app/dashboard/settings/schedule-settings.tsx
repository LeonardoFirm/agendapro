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
  getAppointmentSettings,
  getScheduleSettings,
  updateAppointmentSettings,
  updateScheduleSettings,
} from "./actions";

const defaultSchedule = [
  {
    dayOfWeek: 0,
    day: "Segunda-feira",
    isOpen: true,
    openTime: "08:00",
    closeTime: "18:00",
  },
  {
    dayOfWeek: 1,
    day: "Terça-feira",
    isOpen: true,
    openTime: "08:00",
    closeTime: "18:00",
  },
  {
    dayOfWeek: 2,
    day: "Quarta-feira",
    isOpen: true,
    openTime: "08:00",
    closeTime: "18:00",
  },
  {
    dayOfWeek: 3,
    day: "Quinta-feira",
    isOpen: true,
    openTime: "08:00",
    closeTime: "18:00",
  },
  {
    dayOfWeek: 4,
    day: "Sexta-feira",
    isOpen: true,
    openTime: "08:00",
    closeTime: "18:00",
  },
  {
    dayOfWeek: 5,
    day: "Sábado",
    isOpen: true,
    openTime: "08:00",
    closeTime: "18:00",
  },
  {
    dayOfWeek: 6,
    day: "Domingo",
    isOpen: false,
    openTime: "08:00",
    closeTime: "18:00",
  },
];

export function ScheduleSettings() {
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [isAppointmentLoading, setIsAppointmentLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState(defaultSchedule);
  const [appointmentSettings, setAppointmentSettings] = useState({
    slotDuration: 30,
    bufferTime: 10,
    advanceBooking: 24,
    maxFutureDays: 30,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load schedule settings
        const scheduleSettings = await getScheduleSettings();
        if (scheduleSettings && scheduleSettings.length > 0) {
          const updatedSchedule = defaultSchedule.map((defaultDay) => {
            const savedDay = scheduleSettings.find(
              (day) => day.day_of_week === defaultDay.dayOfWeek,
            );
            if (savedDay) {
              return {
                ...defaultDay,
                isOpen: savedDay.is_open,
                openTime:
                  savedDay.open_time?.substring(0, 5) || defaultDay.openTime,
                closeTime:
                  savedDay.close_time?.substring(0, 5) || defaultDay.closeTime,
              };
            }
            return defaultDay;
          });
          setScheduleData(updatedSchedule);
        }

        // Load appointment settings
        const appointmentData = await getAppointmentSettings();
        if (appointmentData) {
          setAppointmentSettings({
            slotDuration: appointmentData.slot_duration,
            bufferTime: appointmentData.buffer_time,
            advanceBooking: appointmentData.advance_booking,
            maxFutureDays: appointmentData.max_future_days,
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleScheduleChange = (
    index: number,
    field: "isOpen" | "openTime" | "closeTime",
    value: boolean | string,
  ) => {
    setScheduleData((prev) =>
      prev.map((day, i) => (i === index ? { ...day, [field]: value } : day)),
    );
  };

  const handleAppointmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAppointmentSettings((prev) => ({
      ...prev,
      [id
        .replace("-", "")
        .replace("time", "Time")
        .replace("days", "Days")
        .replace("booking", "Booking")
        .replace("duration", "Duration")]: parseInt(value, 10),
    }));
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduleLoading(true);

    try {
      const result = await updateScheduleSettings(scheduleData);

      if (result.success) {
        toast({
          title: "Horários salvos",
          description: "Os horários de funcionamento foram salvos com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description:
            result.error ||
            "Ocorreu um erro ao salvar os horários de funcionamento.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os horários de funcionamento.",
        variant: "destructive",
      });
    } finally {
      setIsScheduleLoading(false);
    }
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAppointmentLoading(true);

    try {
      const result = await updateAppointmentSettings(appointmentSettings);

      if (result.success) {
        toast({
          title: "Configurações salvas",
          description:
            "As configurações de agendamento foram salvas com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description:
            result.error ||
            "Ocorreu um erro ao salvar as configurações de agendamento.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao salvar as configurações de agendamento.",
        variant: "destructive",
      });
    } finally {
      setIsAppointmentLoading(false);
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
          <CardTitle>Horário de Funcionamento</CardTitle>
          <CardDescription>
            Configure os dias e horários de funcionamento
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleScheduleSubmit}>
          <CardContent>
            <div className="space-y-4">
              {scheduleData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`day-${index}`}
                      checked={item.isOpen}
                      onCheckedChange={(checked) =>
                        handleScheduleChange(index, "isOpen", !!checked)
                      }
                    />
                    <Label htmlFor={`day-${index}`} className="font-medium">
                      {item.day}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`open-${index}`} className="text-sm">
                        Abre:
                      </Label>
                      <Input
                        id={`open-${index}`}
                        type="time"
                        value={item.openTime}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "openTime",
                            e.target.value,
                          )
                        }
                        className="w-24"
                        disabled={!item.isOpen}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`close-${index}`} className="text-sm">
                        Fecha:
                      </Label>
                      <Input
                        id={`close-${index}`}
                        type="time"
                        value={item.closeTime}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "closeTime",
                            e.target.value,
                          )
                        }
                        className="w-24"
                        disabled={!item.isOpen}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isScheduleLoading}>
              {isScheduleLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Salvando...
                </>
              ) : (
                "Salvar Horários"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Agendamento</CardTitle>
          <CardDescription>
            Configure as regras para agendamentos
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAppointmentSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slot-duration">Duração do Slot (minutos)</Label>
                <Input
                  id="slot-duration"
                  type="number"
                  value={appointmentSettings.slotDuration}
                  onChange={handleAppointmentChange}
                  min={5}
                  max={240}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buffer-time">
                  Tempo de Intervalo (minutos)
                </Label>
                <Input
                  id="buffer-time"
                  type="number"
                  value={appointmentSettings.bufferTime}
                  onChange={handleAppointmentChange}
                  min={0}
                  max={60}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="advance-booking">
                  Antecedência Mínima (horas)
                </Label>
                <Input
                  id="advance-booking"
                  type="number"
                  value={appointmentSettings.advanceBooking}
                  onChange={handleAppointmentChange}
                  min={0}
                  max={168}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-future-days">Máximo de Dias Futuros</Label>
                <Input
                  id="max-future-days"
                  type="number"
                  value={appointmentSettings.maxFutureDays}
                  onChange={handleAppointmentChange}
                  min={1}
                  max={365}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isAppointmentLoading}>
              {isAppointmentLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Salvando...
                </>
              ) : (
                "Salvar Configurações"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
