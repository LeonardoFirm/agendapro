"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";

type Notification = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
};

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching notifications:", error);
        } else {
          setNotifications(data || []);
        }
      }
      setLoading(false);
    };

    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel("notifications_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking notification as read:", error);
    } else {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification,
        ),
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Você não tem notificações.
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`mb-2 ${!notification.is_read ? "border-l-4 border-l-blue-500" : ""}`}
          onClick={() => !notification.is_read && markAsRead(notification.id)}
        >
          <CardContent className="p-3">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{notification.title}</h4>
              <span className="text-xs text-gray-500">
                {new Date(notification.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
