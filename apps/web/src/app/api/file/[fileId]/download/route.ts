import {auth} from "@repo/utils/auth/next-auth";
import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

export async function GET(_: NextRequest, {params}: {params: {fileId: string}}) {
  const fileId = params.fileId;
  const userData = await auth();
  const token = userData?.user?.access_token;
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("X-Requested-With", "XMLHttpRequest");

  const response = await fetch(`${process.env.BASE_URL}/api/file-service/files/${fileId}/download`, {
    headers,
  });

  const data = await response.arrayBuffer();
  const res = new NextResponse(data, {
    status: response.status,
    headers: response.headers,
  });

  return res;
}
