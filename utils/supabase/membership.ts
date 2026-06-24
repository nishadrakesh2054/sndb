import { createClient } from "@/utils/supabase/client";

const BUCKET = "membership-applications";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type MembershipFormData = {
  name: string;
  email: string;
  phone: string;
  position: string;
  college_name: string;
  passing_year: string;
  nmc_reg_no: string;
  current_working_place: string;
  bloodgroup: string;
  address: string;
  profileImage: File;
  voucherImage: File;
};

function validateImageFile(file: File, label: string) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error(`${label} must be a JPEG, PNG, WebP, or GIF image.`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`${label} must be 5 MB or smaller.`);
  }
}

function buildStoragePath(folder: "profiles" | "vouchers", file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExtension = ["jpg", "jpeg", "png", "webp", "gif"].includes(extension)
    ? extension
    : "jpg";

  return `${folder}/${Date.now()}-${crypto.randomUUID()}.${safeExtension}`;
}

async function uploadMembershipFile(
  folder: "profiles" | "vouchers",
  file: File
): Promise<string> {
  validateImageFile(
    file,
    folder === "profiles" ? "Profile photo" : "Payment voucher"
  );

  const supabase = createClient();
  const path = buildStoragePath(folder, file);

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  return path;
}

export async function submitMembershipApplication(
  data: MembershipFormData
): Promise<void> {
  const [profileImage, voucherImage] = await Promise.all([
    uploadMembershipFile("profiles", data.profileImage),
    uploadMembershipFile("vouchers", data.voucherImage),
  ]);

  const supabase = createClient();

  const { error } = await supabase.from("membership_applications").insert({
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    position: data.position.trim(),
    college_name: data.college_name.trim(),
    passing_year: data.passing_year.trim(),
    nmc_reg_no: data.nmc_reg_no.trim(),
    current_working_place: data.current_working_place.trim(),
    bloodgroup: data.bloodgroup.trim(),
    address: data.address.trim(),
    profile_image: profileImage,
    voucher_image: voucherImage,
  });

  if (error) {
    throw error;
  }
}

export async function getMembershipFileSignedUrl(
  path: string,
  expiresIn = 3600
): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}
