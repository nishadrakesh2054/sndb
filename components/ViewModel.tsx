"use client";

import { useEffect } from "react";
import {
  FaEnvelope,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStethoscope,
  FaTimes,
  FaHospital,
} from "react-icons/fa";

interface ViewModelProps {
  title: string;
  name: string;
  phone?: number;
  email?: string;
  photo?: string;
  workingPlace?: string;
  Degree?: string;
  specialist?: string;
  Address?: string;
  onClose: () => void;
}

type DetailRow = {
  icon: typeof FaPhoneAlt;
  label: string;
  value: string;
  href?: string;
};

const ViewModel: React.FC<ViewModelProps> = ({
  title,
  name,
  phone,
  email,
  photo,
  workingPlace,
  Degree,
  specialist,
  Address,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const details: DetailRow[] = [
    phone && {
      icon: FaPhoneAlt,
      label: "Phone",
      value: String(phone),
      href: `tel:${phone}`,
    },
    email && {
      icon: FaEnvelope,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    workingPlace && {
      icon: FaHospital,
      label: "Working Place",
      value: workingPlace,
    },
    Degree && {
      icon: FaGraduationCap,
      label: "Degree",
      value: Degree,
    },
    specialist && {
      icon: FaStethoscope,
      label: "Specialist",
      value: specialist.trim(),
    },
    Address && {
      icon: FaMapMarkerAlt,
      label: "Address",
      value: Address,
    },
  ].filter(Boolean) as DetailRow[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        aria-label="Close profile"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-gray-300 hover:text-gray-800"
          aria-label="Close"
        >
          <FaTimes className="h-4 w-4" />
        </button>

        <div className="bg-gradient-to-b from-emerald-50/90 to-white px-6 pb-6 pt-10 text-center">
          {photo && (
            <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-[3px] border-white bg-gray-50 shadow-md ring-2 ring-green-600/20">
              <img
                src={photo}
                alt={name}
                className="h-full w-full object-cover object-top"
              />
            </div>
          )}

          <p className="mt-5 text-xs font-medium uppercase tracking-wide text-green-700">
            {title}
          </p>
          <h2
            id="profile-modal-title"
            className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl"
          >
            {name}
          </h2>
        </div>

        <div className="space-y-4 px-6 py-6">
          {details.map((item) => {
            const Icon = item.icon;
            const content = item.href ? (
              <a
                href={item.href}
                className="text-sm font-medium text-green-700 transition hover:text-green-800"
              >
                {item.value}
              </a>
            ) : (
              <p className="text-sm font-medium text-gray-900">{item.value}</p>
            );

            return (
              <div
                key={item.label}
                className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-green-700 shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">
                    {item.label}
                  </p>
                  <div className="mt-0.5 break-words">{content}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewModel;
