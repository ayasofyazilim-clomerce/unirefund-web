import Credentials from "next-auth/providers/credentials";
export type Awaitable<T> = T | PromiseLike<T>;

import { AdapterUser } from "@auth/core/adapters";
import {
  fetchNewAccessTokenByRefreshToken,
  fetchToken,
  getUserData,
} from "./auth-actions";
import NextAuth, { AuthError } from "next-auth";
import { MyUser } from "./auth-types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
        tenant: {},
      },
      authorize: async (credentials) => {
        function authorizeError(message: string) {
          return Promise.reject(new AuthError(JSON.stringify(message)));
        }
        try {
          const signInResponse = await fetchToken({
            username: credentials?.username as string,
            password: credentials.password as string,
            tenantId: credentials.tenant as string,
          });
          if ("error" in signInResponse) {
          }

          if (signInResponse?.access_token && signInResponse.refresh_token) {
            const userData = await getUserData(
              signInResponse.access_token,
              signInResponse.refresh_token,
            );
            return userData;
          }
          return authorizeError("Unknown Error: No token provided");
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn({ user }) {
      if (user.userName) {
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      if (token?.user) {
        const user = token?.user as AdapterUser & MyUser;

        session.user = user;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        if ((token?.exp || 0) * 1000 < Date.now()) {
          const { access_token, refresh_token } =
            await fetchNewAccessTokenByRefreshToken(user.refresh_token || "");

          if (access_token && refresh_token) {
            user.access_token = access_token;
            user.refresh_token = refresh_token;
          }
        }
        token.user = user;
      }

      return token;
    },
  },
});
