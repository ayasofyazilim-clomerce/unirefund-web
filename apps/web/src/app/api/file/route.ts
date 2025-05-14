import {auth} from "@repo/utils/auth/next-auth";

export async function POST(request: Request) {
  const userData = await auth();
  const token = userData?.user?.access_token;
  const formData = await request.formData();
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  return await fetch(`${process.env.BASE_URL}/api/file-service/files`, {
    headers,
    body: formData,
    method: "POST",
  });
}
