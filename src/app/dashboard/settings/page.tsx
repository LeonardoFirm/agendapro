import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfileSettings } from "./profile-settings";
import { BusinessSettings } from "./business-settings";
import { ScheduleSettings } from "./schedule-settings";
import { NotificationSettings } from "./notification-settings";
import { Suspense } from "react";
import { LoadingPage } from "@/components/loading-page";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <SubscriptionCheck>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {/* Header Section */}
          <header>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie as configurações da sua conta e negócio
            </p>
          </header>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="business">Negócio</TabsTrigger>
              <TabsTrigger value="schedule">Agenda</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile" className="mt-6 space-y-6">
              <Suspense fallback={<LoadingPage />}>
                <ProfileSettings user={user} />
              </Suspense>
            </TabsContent>

            {/* Business Settings */}
            <TabsContent value="business" className="mt-6 space-y-6">
              <Suspense fallback={<LoadingPage />}>
                <BusinessSettings />
              </Suspense>
            </TabsContent>

            {/* Schedule Settings */}
            <TabsContent value="schedule" className="mt-6 space-y-6">
              <Suspense fallback={<LoadingPage />}>
                <ScheduleSettings />
              </Suspense>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="mt-6 space-y-6">
              <Suspense fallback={<LoadingPage />}>
                <NotificationSettings />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
