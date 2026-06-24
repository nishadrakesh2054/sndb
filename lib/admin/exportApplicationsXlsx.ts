import * as XLSX from "xlsx";

export type ApplicationExportRow = {
  name: string;
  email: string;
  phone: string;
  position: string;
  college_name: string | null;
  passing_year: string | null;
  nmc_reg_no: string | null;
  current_working_place: string | null;
  bloodgroup: string | null;
  address: string | null;
  profile_image: string;
  voucher_image: string;
  created_at: string;
};

const cell = (value: string | null | undefined) => value?.trim() || "";

const formatExportDate = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export function exportApplicationsToXlsx(rows: ApplicationExportRow[]) {
  const sheetData = rows.map((row) => ({
    "Full Name": row.name,
    Email: row.email,
    Phone: row.phone,
    "Specialist / Designation": row.position,
    "College Name": cell(row.college_name),
    "Passing Year": cell(row.passing_year),
    "NMC Reg. No.": cell(row.nmc_reg_no),
    "Current Working Place": cell(row.current_working_place),
    "Blood Group": cell(row.bloodgroup),
    Address: cell(row.address),
    "Profile Image": row.profile_image,
    "Payment Voucher": row.voucher_image,
    Submitted: formatExportDate(row.created_at),
  }));

  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

  const dateStamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `sndb-membership-applications-${dateStamp}.xlsx`);
}
