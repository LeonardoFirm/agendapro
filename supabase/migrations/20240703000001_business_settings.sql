CREATE TABLE IF NOT EXISTS business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  business_type TEXT,
  business_address TEXT,
  business_phone TEXT,
  business_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schedule_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  is_open BOOLEAN DEFAULT true,
  open_time TIME,
  close_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS appointment_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slot_duration INTEGER DEFAULT 30,
  buffer_time INTEGER DEFAULT 10,
  advance_booking INTEGER DEFAULT 24,
  max_future_days INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, notification_type)
);

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_type TEXT NOT NULL,
  template_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, template_type)
);

-- Create RLS policies
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for business_settings
CREATE POLICY "Users can view their own business settings"
  ON business_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business settings"
  ON business_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business settings"
  ON business_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for schedule_settings
CREATE POLICY "Users can view their own schedule settings"
  ON schedule_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own schedule settings"
  ON schedule_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedule settings"
  ON schedule_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for appointment_settings
CREATE POLICY "Users can view their own appointment settings"
  ON appointment_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own appointment settings"
  ON appointment_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointment settings"
  ON appointment_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for notification_settings
CREATE POLICY "Users can view their own notification settings"
  ON notification_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification settings"
  ON notification_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification settings"
  ON notification_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for email_templates
CREATE POLICY "Users can view their own email templates"
  ON email_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email templates"
  ON email_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email templates"
  ON email_templates FOR UPDATE
  USING (auth.uid() = user_id);

-- Add tables to realtime publication
alter publication supabase_realtime add table business_settings;
alter publication supabase_realtime add table schedule_settings;
alter publication supabase_realtime add table appointment_settings;
alter publication supabase_realtime add table notification_settings;
alter publication supabase_realtime add table email_templates;