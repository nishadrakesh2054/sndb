"use client";

import { useState } from "react";
import {
  FaArrowRight,
  FaEnvelope,
  FaFacebookF,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/PageHeader";
import { submitContactMessage } from "@/utils/supabase/contact";

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 transition focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

const contactDetails = [
  {
    icon: FaMapMarkerAlt,
    title: "Location",
    value: "Kathmandu, Nepal",
  },
  {
    icon: FaPhoneAlt,
    title: "Phone",
    value: "+977 9817073670",
    href: "tel:+9779817073670",
  },
  {
    icon: FaEnvelope,
    title: "Email",
    value: "sndbdoctors@gmail.com",
    href: "mailto:sndbdoctors@gmail.com",
  },
];

const socialLinks = [
  {
    icon: FaFacebookF,
    href: "https://www.facebook.com/share/PxQiCqxYdNR851RL/?mibextid=LQQJ4d",
    label: "Facebook",
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/9779817073670",
    label: "WhatsApp",
  },
];

const Contact = ({ isHomeSection = false }: { isHomeSection?: boolean }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    success: string | null;
    error: string | null;
  }>({
    success: null,
    error: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (status.success || status.error) {
      setStatus({ success: null, error: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ success: null, error: null });

    try {
      await submitContactMessage(formData);
      setStatus({
        success: "Thank you — your message has been sent.",
        error: null,
      });
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again later.";
      setStatus({ success: null, error: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageSection>
        <PageContainer>
          <PageHeader
            label="Contact Us"
            as={isHomeSection ? "h2" : "h1"}
            title={
              <>
                Get In <span className="text-green-600">Touch</span>
              </>
            }
            subtitle="Reach out for membership, partnerships, or general inquiries."
          />

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-5">
              <aside className="border-b border-gray-100 bg-emerald-50 p-8 lg:col-span-2 lg:border-b-0 lg:border-r lg:p-10">
                <h3 className="text-lg font-semibold text-gray-900">
                  Contact Information
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Our team will get back to you as soon as possible.
                </p>

                <ul className="mt-8 space-y-4">
                  {contactDetails.map((item) => {
                    const Icon = item.icon;
                    const row = (
                      <div className="flex items-start gap-4 rounded-xl border border-emerald-100 bg-white p-4 transition-shadow hover:shadow-sm">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-green-700">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-800">{item.value}</p>
                        </div>
                      </div>
                    );

                    return (
                      <li key={item.title}>
                        {item.href ? (
                          <a href={item.href} className="block">
                            {row}
                          </a>
                        ) : (
                          row
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8 border-t border-emerald-100 pt-8">
                  <p className="mb-4 text-xs font-medium uppercase tracking-wider text-green-700">
                    Follow Us
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-green-700 transition hover:border-green-600 hover:bg-green-600 hover:text-white"
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </aside>

              <form
                className="p-8 lg:col-span-3 lg:p-10"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="mb-8 border-b border-gray-100 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Send a Message
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Fill in the form below and we will respond promptly.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={inputClass}
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={inputClass}
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+977 98XXXXXXXX"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className={labelClass} htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputClass}
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mt-6">
                  <label className={labelClass} htmlFor="message">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    className={`${inputClass} resize-none`}
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {status.success && (
                  <p
                    role="status"
                    className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                  >
                    {status.success}
                  </p>
                )}
                {status.error && (
                  <p
                    role="alert"
                    className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {status.error}
                  </p>
                )}

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-500">
                    Fields marked with <span className="text-red-500">*</span> are
                    required.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && (
                      <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </PageContainer>
      </PageSection>
    </>
  );
};

export default Contact;
