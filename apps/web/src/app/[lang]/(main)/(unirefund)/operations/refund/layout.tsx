"use server";

import {auth} from "@repo/utils/auth/next-auth";

export default async function Layout({refundPoint, admin}: {admin: React.ReactNode; refundPoint: React.ReactNode}) {
  const session = await auth();

  if (session?.user?.role === "admin") {
    return admin;
  }

  return refundPoint;
}
