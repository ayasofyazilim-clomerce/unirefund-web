import "next-auth";
import "@auth/core/jwt";
import { MyUser, UserRole } from "./auth-types";

declare module "next-auth" {
  interface Session {
    user?: MyUser;
  }
  interface User extends MyUser {}
}

declare module "@auth/core/jwt" {
  interface JWT {
    access_token: string;
    expires_at: number;
    error?: "RefreshAccessTokenError";
    user: MyUser;
  }
}
