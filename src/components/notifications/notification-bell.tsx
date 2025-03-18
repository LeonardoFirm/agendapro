"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from "./notification-list";
import { createClient } from "../../../supabase/client";
import { Badge } from "@/components/ui/badge";

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { count, error } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_read", false);

        if (error) {
          console.error("Error fetching unread count:", error);
        } else {
          setUnreadCount(count || 0);
        }
      }
    };

    fetchUnreadCount();

    // Subscribe to notification changes
    const channel = supabase
      .channel("notification_count")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchUnreadCount();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);

    // Mark all as read when opening the popover
    if (newOpen && unreadCount > 0) {
      const markAllAsRead = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", user.id)
            .eq("is_read", false);

          if (error) {
            console.error("Error marking notifications as read:", error);
          } else {
            setUnreadCount(0);
          }
        }
      };
      markAllAsRead();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-2 border-b border-gray-200 bg-gray-50">
          <h3 className="font-medium">Notificações</h3>
        </div>
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
}
