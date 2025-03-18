"use server";

import { createClient } from "../../../../supabase/server";
import { revalidatePath } from "next/cache";

type ProfileData = {
  fullName: string;
  phone: string;
};

type PasswordData = {
  currentPassword: string;
  newPassword: string;
};

type BusinessData = {
  businessName: string;
  businessType: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
};

type ScheduleDay = {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

type AppointmentSettingsData = {
  slotDuration: number;
  bufferTime: number;
  advanceBooking: number;
  maxFutureDays: number;
};

type NotificationSetting = {
  notificationType: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
};

type EmailTemplateData = {
  confirmationTemplate: string;
  reminderTemplate: string;
  cancellationTemplate: string;
};

export async function updateProfile(data: ProfileData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Usuário não autenticado" };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: data.fullName,
      phone: data.phone,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updatePassword(data: PasswordData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: data.newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateBusinessInfo(data: BusinessData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Usuário não autenticado" };
  }

  // Check if business settings already exist
  const { data: existingSettings } = await supabase
    .from("business_settings")
    .select("id")
    .eq("user_id", user.id)
    .single();

  let error;

  if (existingSettings) {
    // Update existing settings
    const { error: updateError } = await supabase
      .from("business_settings")
      .update({
        business_name: data.businessName,
        business_type: data.businessType,
        business_address: data.businessAddress,
        business_phone: data.businessPhone,
        business_email: data.businessEmail,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    error = updateError;
  } else {
    // Insert new settings
    const { error: insertError } = await supabase
      .from("business_settings")
      .insert({
        user_id: user.id,
        business_name: data.businessName,
        business_type: data.businessType,
        business_address: data.businessAddress,
        business_phone: data.businessPhone,
        business_email: data.businessEmail,
      });

    error = insertError;
  }

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateScheduleSettings(scheduleData: ScheduleDay[]) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Usuário não autenticado" };
  }

  // Delete existing schedule settings for this user
  const { error: deleteError } = await supabase
    .from("schedule_settings")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  // Insert new schedule settings
  const scheduleItems = scheduleData.map((day) => ({
    user_id: user.id,
    day_of_week: day.dayOfWeek,
    is_open: day.isOpen,
    open_time: day.openTime,
    close_time: day.closeTime,
  }));

  const { error } = await supabase
    .from("schedule_settings")
    .insert(scheduleItems);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateAppointmentSettings(data: AppointmentSettingsData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Usuário não autenticado" };
  }

  // Check if appointment settings already exist
  const { data: existingSettings } = await supabase
    .from("appointment_settings")
    .select("id")
    .eq("user_id", user.id)
    .single();

  let error;

  if (existingSettings) {
    // Update existing settings
    const { error: updateError } = await supabase
      .from("appointment_settings")
      .update({
        slot_duration: data.slotDuration,
        buffer_time: data.bufferTime,
        advance_booking: data.advanceBooking,
        max_future_days: data.maxFutureDays,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    error = updateError;
  } else {
    // Insert new settings
    const { error: insertError } = await supabase
      .from("appointment_settings")
      .insert({
        user_id: user.id,
        slot_duration: data.slotDuration,
        buffer_time: data.bufferTime,
        advance_booking: data.advanceBooking,
        max_future_days: data.maxFutureDays,
      });

    error = insertError;
  }

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateNotificationSettings(
  notificationSettings: NotificationSetting[],
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Usuário não autenticado" };
  }

  // Delete existing notification settings for this user
  const { error: deleteError } = await supabase
    .from("notification_settings")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  // Insert new notification settings
  const notificationItems = notificationSettings.map((setting) => ({
    user_id: user.id,
    notification_type: setting.notificationType,
    email_enabled: setting.emailEnabled,
    sms_enabled: setting.smsEnabled,
    push_enabled: setting.pushEnabled,
  }));

  const { error } = await supabase
    .from("notification_settings")
    .insert(notificationItems);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateEmailTemplates(data: EmailTemplateData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Usuário não autenticado" };
  }

  // Delete existing email templates for this user
  const { error: deleteError } = await supabase
    .from("email_templates")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  // Insert new email templates
  const templates = [
    {
      user_id: user.id,
      template_type: "confirmation",
      template_content: data.confirmationTemplate,
    },
    {
      user_id: user.id,
      template_type: "reminder",
      template_content: data.reminderTemplate,
    },
    {
      user_id: user.id,
      template_type: "cancellation",
      template_content: data.cancellationTemplate,
    },
  ];

  const { error } = await supabase.from("email_templates").insert(templates);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function getBusinessSettings() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data } = await supabase
    .from("business_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data;
}

export async function getScheduleSettings() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  const { data } = await supabase
    .from("schedule_settings")
    .select("*")
    .eq("user_id", user.id)
    .order("day_of_week");

  return data || [];
}

export async function getAppointmentSettings() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data } = await supabase
    .from("appointment_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data;
}

export async function getNotificationSettings() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  const { data } = await supabase
    .from("notification_settings")
    .select("*")
    .eq("user_id", user.id);

  return data || [];
}

export async function getEmailTemplates() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  const { data } = await supabase
    .from("email_templates")
    .select("*")
    .eq("user_id", user.id);

  return data || [];
}
