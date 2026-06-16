import { createClient } from "@/utils/supabase/client";

const BUCKET = "site-media";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function validateImageFile(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Image must be a JPEG, PNG, WebP, or GIF file.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must be 10 MB or smaller.");
  }
}

function buildStoragePath(folder: string, file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExtension = ["jpg", "jpeg", "png", "webp", "gif"].includes(extension)
    ? extension
    : "jpg";

  return `${folder}/${Date.now()}-${crypto.randomUUID()}.${safeExtension}`;
}

/** Upload to public site-media bucket; returns path stored in DB (site-media/...) */
export async function uploadSiteMedia(folder: string, file: File): Promise<string> {
  validateImageFile(file);

  const supabase = createClient();
  const path = buildStoragePath(folder, file);

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  return `${BUCKET}/${path}`;
}

const DOCUMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const DOCUMENT_MAX_SIZE = 15 * 1024 * 1024;

function buildDocumentPath(folder: string, file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";

  if (file.type === "application/pdf") {
    return `${folder}/${Date.now()}-${crypto.randomUUID()}.pdf`;
  }

  const safeExtension = ["jpg", "jpeg", "png", "webp", "gif"].includes(extension)
    ? extension
    : "jpg";

  return `${folder}/${Date.now()}-${crypto.randomUUID()}.${safeExtension}`;
}

/** Upload PDF or image to public site-media bucket; returns path stored in DB (site-media/...) */
export async function uploadSiteDocument(folder: string, file: File): Promise<string> {
  if (!DOCUMENT_TYPES.has(file.type)) {
    throw new Error("Document must be a PDF or image file (JPEG, PNG, WebP, GIF).");
  }

  if (file.size > DOCUMENT_MAX_SIZE) {
    throw new Error("Document must be 15 MB or smaller.");
  }

  const supabase = createClient();
  const path = buildDocumentPath(folder, file);

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  return `${BUCKET}/${path}`;
}
