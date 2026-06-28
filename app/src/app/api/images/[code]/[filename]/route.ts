import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { CONTENT_ROOT, isValidSessionCode } from "@/lib/content/sessions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string; filename: string }> }
) {
  const { code, filename } = await params;

  // Validate session code to prevent path traversal
  if (!isValidSessionCode(code)) {
    return new NextResponse("Invalid session code", { status: 400 });
  }

  // Validate filename to prevent path traversal
  if (!/^[a-zA-Z0-9_\-\.]+$/.test(filename)) {
    return new NextResponse("Invalid filename", { status: 400 });
  }

  const filePath = join(CONTENT_ROOT, `Teaching-Kit-${code}`, "images", filename);

  try {
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on extension
    let contentType = "image/png";
    if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } else if (filename.endsWith(".svg")) {
      contentType = "image/svg+xml";
    } else if (filename.endsWith(".webp")) {
      contentType = "image/webp";
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Image not found", { status: 404 });
  }
}
