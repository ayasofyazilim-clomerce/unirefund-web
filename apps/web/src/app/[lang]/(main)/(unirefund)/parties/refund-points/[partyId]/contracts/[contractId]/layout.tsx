"use server";
import {isUnauthorized} from "@repo/utils/policies";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
    contractId: string;
    partyId: string;
  };
}) {
  const {lang} = params;

  await isUnauthorized({
    requiredPolicies: ["ContractService.ContractHeaderForRefundPoint"],
    lang,
  });

  return <>{children}</>;
}
