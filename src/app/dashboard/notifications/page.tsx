import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { NotificationList } from "@/components/notifications/notification-list";
import { SubscriptionCheck } from "@/components/subscription-check";

export default async function NotificationsPage() {
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
            <h1 className="text-3xl font-bold">Notificações</h1>
            <p className="text-muted-foreground">
              Gerencie suas notificações e lembretes
            </p>
          </header>

          {/* Notifications List */}
          <NotificationList />
        </div>
      </main>
    </SubscriptionCheck>
  );
}
