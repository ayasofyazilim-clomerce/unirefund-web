import {auth} from "@repo/utils/auth/next-auth";

export async function GET({params}: {params: Promise<{fileId: string}>}) {
  const fileId = (await params).fileId;
  const userData = await auth();
  const token = userData?.user?.access_token;
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("X-Requested-With", "XMLHttpRequest");
  const x = await fetch(`${process.env.BASE_URL}/api/file-service/files/${fileId}/download`, {
    headers,
  });
  return x;
}
