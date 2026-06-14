"use client";

import { useState, useEffect } from "react";
import NepaliDate from "nepali-datetime";
import { FaCalendarAlt } from "react-icons/fa";

const LogoTop: React.FC = () => {
  const [nepaliDay, setNepaliDay] = useState("");
  const [nepaliDateLine, setNepaliDateLine] = useState("");
  const [englishDate, setEnglishDate] = useState("");

  useEffect(() => {
    const date = new Date();
    const nepaliDateObj = new NepaliDate(date);
    setNepaliDay(nepaliDateObj.format("dddd"));
    setNepaliDateLine(nepaliDateObj.format("DD MMMM YYYY"));
    setEnglishDate(
      date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="max-w-7xl mx-auto ">
      <div className="md:flex justify-between items-center py-2  hidden ">
        {/* Left side: Logo and Text */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <img
            src="/sndblogo1.png" // replace with your logo URL
            alt="Logo"
            className="h-28 w-28 object-contain "
          />
          {/* Text */}
          <div>
            <h1 className="text-2xl font-bold text-green-600">
              {/* बंगलादेशस्थित नेपाली चिकित्सक समाज */}
              सोसाइटी फर नेप्लिज डॉक्टर्स फ्रॉम बंगलादेश
            </h1>
            <p className="text-lg text-red-700 font-semibold">
              Society For Nepalese Doctors from Bangladesh
            </p>
          </div>
        </div>

        {/* Right side: Date display */}
        <div className="flex overflow-hidden rounded-xl border border-green-200/80 bg-gradient-to-br from-white to-green-50/80 shadow-sm">
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-green-700 to-green-800 px-4 py-3 text-white">
            <FaCalendarAlt className="h-5 w-5 text-green-100" />
            <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-green-200/90">
              Today
            </span>
          </div>
          <div className="flex flex-col justify-center px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
              {nepaliDay}
            </p>
            <p className="text-base font-bold leading-snug text-green-800">
              {nepaliDateLine}
            </p>
            <p className="mt-1 text-xs text-gray-500">{englishDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoTop;
