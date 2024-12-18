import type { AdapterUser } from "@auth/core/adapters";
import "@auth/core/jwt";
import type { GetApiAccountMyProfileResponse } from "@ayasofyazilim/saas/AccountService";
import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  getGrantedPolicies,
  getMyProfile,
  getTenantData,
  obtainAccessTokenByRefreshToken,
  signInWithCredentials,
} from "auth-action";

export type Awaitable<T> = T | PromiseLike<T>;

export interface Token {
  id?: string;
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  id_token?: string;
  expires_at?: number;
}

declare module "next-auth" {
  interface User extends Token {
    userName: string;
  }
}

declare module "next-auth" {
  interface Session {
    error?: "RefreshAccessTokenError" | string;
    access_token?: string;
    user?: GetApiAccountMyProfileResponse;
    grantedPolicies?: Record<string, boolean>;
    tenantData?: { tenantId: string; tenantName: string };
  }
}
declare module "@auth/core/jwt" {
  interface JWT extends Token {
    access_token: string;
    expires_at: number;
    refresh_token: string;
    error?: "RefreshAccessTokenError";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
        tenant: { label: "Tenant", type: "text" },
      },

      authorize: async (credentials) => {
        try {
          const response = await signInWithCredentials(
            credentials as {
              username: string;
              password: string;
              tenantId?: string;
            },
          );
          if ("error" in response && typeof response.error !== "object") {
            const error = `${response.error}: ${response.error_description}`;
            return Promise.reject(new AuthError(error));
          }
          if ("error" in response) {
            const responseError = response.error as unknown as {
              code: string;
              message: string;
              details: string;
            };
            const error = `${responseError.code}: ${responseError.details}`;
            return Promise.reject(new AuthError(error));
          }
          if (response.access_token) {
            return { ...response };
          }
          return Promise.reject(
            new AuthError("Unknown Error: No token provided"),
          );
        } catch (error) {
          return Promise.reject(new Error(`Unknown Error ${String(error)}`));
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
      if (user.access_token) {
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      const typedToken = token as unknown as Token;
      if (token.error) {
        return {
          ...session,
          error: token.error,
        };
      }
      if (typedToken.access_token === undefined) {
        return {
          ...session,
          error: "NoAccessToken",
        };
      }
      const userData = await getMyProfile(typedToken.access_token);
      const tenantData = await getTenantData(typedToken.access_token);
      const grantedPolicies = await getGrantedPolicies(typedToken.access_token);
      return {
        ...session,
        user: userData,
        access_token: typedToken.access_token,
        grantedPolicies: grantedPolicies || {},
        tenantData,
      };
    },
    async jwt({ token, user }) {
      const _user = user as AdapterUser | undefined;
      const typedToken = token as unknown as Token;
      if (_user) {
        return {
          ...token,
          access_token: user.access_token,
          expires_at: Math.floor(Date.now() / 1000) + (user.expires_in || 0),
          refresh_token: user.refresh_token,
        };
      } else if (Date.now() < (typedToken.expires_at || 0) * 1000) {
        return token;
      }
      if (typedToken.refresh_token === undefined) {
        throw new Error("No refresh token");
      }
      const tokens = await obtainAccessTokenByRefreshToken(
        typedToken.refresh_token,
      );
      if ("error" in tokens) {
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
      if (!tokens.access_token || !tokens.expires_in) {
        return {
          ...token,
          error: "NoAccessToken",
        };
      }
      return {
        ...token,
        access_token: tokens.access_token,
        expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
        refresh_token: tokens.refresh_token ?? token.refresh_token,
      };
    },
  },
});
