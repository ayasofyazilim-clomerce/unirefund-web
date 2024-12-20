import { AuthPage } from "./client";

export default function Page() {
  return (
    <AuthPage
      tenantId={
        process.env.NODE_ENV === "development" && process.env.TENANT_ID
          ? process.env.TENANT_ID
          : ""
      }
    />
  );
}
