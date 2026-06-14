"use client";

import { useState } from "react";
import { FaArrowRight, FaUpload } from "react-icons/fa";
import { submitMembershipApplication } from "@/utils/supabase/membership";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 transition focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

const fileInputClass =
  "block w-full cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 transition file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-green-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-green-400 hover:bg-emerald-50/40";

const MembershipForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [voucherImage, setVoucherImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [voucherImagePreview, setVoucherImagePreview] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    success: string | null;
    error: string | null;
  }>({ success: null, error: null });

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
      setStatus({ success: null, error: null });
    }
  };

  const handleVoucherImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVoucherImage(file);
      setVoucherImagePreview(URL.createObjectURL(file));
      setStatus({ success: null, error: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ success: null, error: null });

    if (!name || !email || !phone || !position || !profileImage || !voucherImage) {
      setStatus({
        success: null,
        error: "Please fill in all fields and upload the required images.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitMembershipApplication({
        name,
        email,
        phone,
        position,
        profileImage,
        voucherImage,
      });

      setStatus({
        success: "Your membership application has been submitted successfully.",
        error: null,
      });
      setName("");
      setEmail("");
      setPhone("");
      setPosition("");
      setProfileImage(null);
      setVoucherImage(null);
      setProfileImagePreview(null);
      setVoucherImagePreview(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "There was an error submitting the form. Please try again.";
      setStatus({
        success: null,
        error: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <FaUpload className="h-4 w-4 text-green-700" />
          <h2 className="text-xl font-bold text-gray-900">Apply Online</h2>
        </div>
        <p className="text-sm leading-relaxed text-gray-600">
          Complete the form below and upload your profile photo and payment
          voucher.
        </p>
      </div>

      {status.success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {status.success}
        </div>
      )}

      {status.error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {status.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Enter your full name"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div>
          <label htmlFor="position" className={labelClass}>
            Specialist / Designation <span className="text-red-500">*</span>
          </label>
          <input
            id="position"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className={inputClass}
            placeholder="Enter your specialist field"
          />
        </div>

        <div>
          <label htmlFor="profileImage" className={labelClass}>
            Profile Photo <span className="text-red-500">*</span>
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className={fileInputClass}
          />
          {profileImagePreview && (
            <div className="mt-4 flex justify-center">
              <img
                src={profileImagePreview}
                alt="Profile preview"
                className="h-24 w-24 rounded-full border-2 border-gray-200 object-cover object-top shadow-sm"
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="voucherImage" className={labelClass}>
            Payment Voucher <span className="text-red-500">*</span>
          </label>
          <input
            id="voucherImage"
            type="file"
            accept="image/*"
            onChange={handleVoucherImageChange}
            className={fileInputClass}
          />
          {voucherImagePreview && (
            <div className="mt-4">
              <img
                src={voucherImagePreview}
                alt="Voucher preview"
                className="max-h-32 rounded-lg border border-gray-200 object-contain shadow-sm"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
          {!isSubmitting && (
            <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MembershipForm;
