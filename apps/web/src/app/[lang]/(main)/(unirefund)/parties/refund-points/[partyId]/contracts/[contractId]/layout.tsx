"use server";
import { isUnauthorized } from "src/utils/page-policy/page-policy";

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
  const { lang } = params;

  await isUnauthorized({
    requiredPolicies: [
      "ContractService.ContractHeaderForRefundPoint",
      "ContractService.ContractHeaderForRefundPoint.Edit",
    ],
    lang,
  });

  return <>{children}</>;
}
