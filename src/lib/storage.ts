import { v4 as uuidv4 } from "uuid";

export async function uploadPhoto(photo: File): Promise<string> {
  const ext = photo.name.split(".").pop() || "jpg";
  const filename = `${uuidv4()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Production: use Vercel Blob
    const { put } = await import("@vercel/blob");
    const blob = await put(`dogs/${filename}`, photo, { access: "public" });
    return blob.url;
  } else {
    // Local dev: save to public/uploads
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const filepath = path.join(uploadsDir, filename);
    const bytes = new Uint8Array(await photo.arrayBuffer());
    await writeFile(filepath, bytes);
    return `/uploads/${filename}`;
  }
}
