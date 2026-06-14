import { createClient } from "@/utils/supabase/client";

export type ContactFormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export async function submitContactMessage(data: ContactFormData) {
  const supabase = createClient();

  const { error } = await supabase.from("contact_messages").insert({
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    message: data.message.trim(),
  });

  if (error) {
    throw error;
  }
}
