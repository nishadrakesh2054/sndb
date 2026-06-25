import { NextResponse } from "next/server";
import { isMailConfigured, sendMembershipEmails } from "@/lib/mail";
import { isValidEmail, requireString } from "@/lib/mail/validate";

export async function POST(request: Request) {
  if (!isMailConfigured()) {
    return NextResponse.json({ success: true, skipped: true });
  }

  try {
    const body = await request.json();

    const payload = {
      name: requireString(body.name, "Name"),
      email: requireString(body.email, "Email"),
      phone: requireString(body.phone, "Phone"),
      position: requireString(body.position, "Position"),
      college_name: requireString(body.college_name, "College name"),
      passing_year: requireString(body.passing_year, "Passing year"),
      nmc_reg_no: requireString(body.nmc_reg_no, "NMC registration number"),
      current_working_place: requireString(
        body.current_working_place,
        "Current working place"
      ),
      bloodgroup: requireString(body.bloodgroup, "Blood group"),
      address: requireString(body.address, "Address"),
    };

    if (!isValidEmail(payload.email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    await sendMembershipEmails(payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Membership email delivery failed:", error);
    return NextResponse.json(
      { error: "Failed to send confirmation emails." },
      { status: 500 }
    );
  }
}
