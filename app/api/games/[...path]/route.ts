import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import FirebaseAdminApp from "@/app/lib/firebase-admin";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filePath = "games/" + params.path.join("/");

  const storage = getStorage(FirebaseAdminApp);
  const bucket = storage.bucket("gs://kyouryoku-play.appspot.com");
  const file = bucket.file(filePath);

  try {
    const [exists] = await file.exists();
    if (!exists) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const [metadata] = await file.getMetadata();
    const [fileContent] = await file.download();

    const headers = new Headers();
    headers.set("Content-Type", metadata.contentType!);
    headers.set("Content-Length", metadata.size?.toString()!);

    return new NextResponse(fileContent, {
      status: 200,
      statusText: "OK",
      headers,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
