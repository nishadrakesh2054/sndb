"use client";

import { useState } from "react";
import { FaArrowRight, FaUpload } from "react-icons/fa";
import { submitMembershipApplication } from "@/utils/supabase/membership";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 transition focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20";

const labelClass = "mb-1 block text-xs font-medium text-gray-700";

const fileInputClass =
  "block w-full cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5 text-xs text-gray-600 transition file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-green-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-green-400 hover:bg-emerald-50/40";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  position: "",
  college_name: "",
  passing_year: "",
  nmc_reg_no: "",
  current_working_place: "",
  bloodgroup: "",
  address: "",
};

const MembershipForm: React.FC = () => {
  const [form, setForm] = useState(emptyForm);
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

  const updateField = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus({ success: null, error: null });
  };

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

  const resetForm = () => {
    setForm(emptyForm);
    setProfileImage(null);
    setVoucherImage(null);
    setProfileImagePreview(null);
    setVoucherImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ success: null, error: null });

    const missingField = Object.entries(form).find(([, value]) => !value.trim());
    if (missingField || !profileImage || !voucherImage) {
      setStatus({
        success: null,
        error: "Please fill in all fields and upload the required images.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitMembershipApplication({
        ...form,
        profileImage,
        voucherImage,
      });

      setStatus({
        success: "Your membership application has been submitted successfully.",
        error: null,
      });
      resetForm();
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
    <div className="overflow-hidden rounded-2xl border border-green-200/80 bg-white shadow-[0_10px_40px_-16px_rgba(22,101,52,0.35)] ring-1 ring-green-600/5">
      <div className="h-1 bg-gradient-to-r from-green-800 via-green-600 to-green-700" />

      <div className="p-5 sm:p-6">
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-2">
            <FaUpload className="h-4 w-4 text-green-700" />
            <h2 className="text-lg font-bold text-gray-900">Apply Online</h2>
          </div>
          <p className="text-xs leading-relaxed text-gray-600">
            Complete the form and upload your profile photo and payment voucher.
          </p>
        </div>

        {status.success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800">
            {status.success}
          </div>
        )}

        {status.error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={inputClass}
              placeholder="Full name"
            />
          </div>

          <div>
            <label htmlFor="position" className={labelClass}>
              Specialist / Designation <span className="text-red-500">*</span>
            </label>
            <input
              id="position"
              type="text"
              value={form.position}
              onChange={(e) => updateField("position", e.target.value)}
              className={inputClass}
              placeholder="Specialist field"
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
              placeholder="Email address"
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="text"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass}
              placeholder="Phone number"
            />
          </div>

          <div>
            <label htmlFor="college_name" className={labelClass}>
              College Name <span className="text-red-500">*</span>
            </label>
            <input
              id="college_name"
              type="text"
              value={form.college_name}
              onChange={(e) => updateField("college_name", e.target.value)}
              className={inputClass}
              placeholder="Medical college"
            />
          </div>

          <div>
            <label htmlFor="passing_year" className={labelClass}>
              Passing Year <span className="text-red-500">*</span>
            </label>
            <input
              id="passing_year"
              type="number"
              min={1950}
              max={new Date().getFullYear()}
              value={form.passing_year}
              onChange={(e) => updateField("passing_year", e.target.value)}
              className={inputClass}
              placeholder="e.g. 2018"
            />
          </div>

          <div>
            <label htmlFor="nmc_reg_no" className={labelClass}>
              NMC Reg. No. <span className="text-red-500">*</span>
            </label>
            <input
              id="nmc_reg_no"
              type="text"
              value={form.nmc_reg_no}
              onChange={(e) => updateField("nmc_reg_no", e.target.value)}
              className={inputClass}
              placeholder="NMC registration number"
            />
          </div>

          <div>
            <label htmlFor="bloodgroup" className={labelClass}>
              Blood Group <span className="text-red-500">*</span>
            </label>
            <select
              id="bloodgroup"
              value={form.bloodgroup}
              onChange={(e) => updateField("bloodgroup", e.target.value)}
              className={inputClass}
            >
              <option value="">Select blood group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="current_working_place" className={labelClass}>
              Current Working Place <span className="text-red-500">*</span>
            </label>
            <input
              id="current_working_place"
              type="text"
              value={form.current_working_place}
              onChange={(e) =>
                updateField("current_working_place", e.target.value)
              }
              className={inputClass}
              placeholder="Hospital / clinic"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className={labelClass}>
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              rows={2}
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Full address"
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
            {profileImagePreview ? (
              <div className="mt-2 flex justify-center">
                <img
                  src={profileImagePreview}
                  alt="Profile preview"
                  className="h-20 w-20 rounded-full border-2 border-gray-200 object-cover object-top shadow-sm"
                />
              </div>
            ) : null}
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
            {voucherImagePreview ? (
              <div className="mt-2">
                <img
                  src={voucherImagePreview}
                  alt="Voucher preview"
                  className="max-h-24 rounded-lg border border-gray-200 object-contain shadow-sm"
                />
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
          {!isSubmitting && (
            <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          )}
        </button>
        </form>
      </div>
    </div>
  );
};

export default MembershipForm;
