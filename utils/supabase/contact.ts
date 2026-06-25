export type ContactFormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export async function submitContactMessage(data: ContactFormData) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof result.error === "string"
        ? result.error
        : "Failed to send message. Please try again later."
    );
  }
}
