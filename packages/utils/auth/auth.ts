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
        tenantId: {},
      },
      authorize: async (credentials) => {
        function authorizeError(message: string) {
          return Promise.reject(new AuthError(JSON.stringify(message)));
        }
        try {
          const signInResponse = await fetchToken({
            username: credentials?.username as string,
            password: credentials.password as string,
            tenantId: credentials.tenantId as string,
          });
          if (signInResponse.error_description) {
            return authorizeError(signInResponse.error_description);
          }
          const { access_token, refresh_token, expires_in } = signInResponse;
          const expiration_date = expires_in * 1000 + Date.now();

          const user_data = await getUserData(
            access_token,
            refresh_token,
            expiration_date,
          );
          return user_data;
        } catch (error) {
          console.log(error);
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
        if (user.expiration_date < Date.now()) {
          const { access_token, refresh_token, expires_in } =
            await fetchNewAccessTokenByRefreshToken(user.refresh_token || "");

          if (access_token && refresh_token) {
            user.access_token = access_token;
            user.refresh_token = refresh_token;
            user.expiration_date = expires_in * 1000 + Date.now();
          }
        }
        session.user = user;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
  },
});
