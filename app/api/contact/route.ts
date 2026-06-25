import { NextResponse } from "next/server";
import { isMailConfigured, sendContactEmails } from "@/lib/mail";
import { isValidEmail, requireString } from "@/lib/mail/validate";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = requireString(body.name, "Name");
    const phone = requireString(body.phone, "Phone");
    const email = requireString(body.email, "Email");
    const message = requireString(body.message, "Message");

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name,
      phone,
      email,
      message,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to save your message. Please try again." },
        { status: 500 }
      );
    }

    if (isMailConfigured()) {
      try {
        await sendContactEmails({ name, phone, email, message });
      } catch (mailError) {
        console.error("Contact email delivery failed:", mailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
