import {SessionProvider} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";

export default async function Layout({children}: {children: React.ReactNode}) {
  const session = await auth();

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
