"use server";
import { notFound } from "next/navigation";
import { getRebateTableHeadersByIdApi } from "src/actions/unirefund/ContractService/action";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import RebateTableHeaderUpdateForm from "./_components/form";

export default async function Page({
  params,
}: {
  params: { lang: string; type: string; id: string };
}) {
  await isUnauthorized({
    requiredPolicies: [
      "ContractService.RebateTableDetail.Create",
      "ContractService.RebateTableDetail.Edit",
      "ContractService.RebateTableDetail.Delete",
      "ContractService.RebateTableHeader.Create",
      "ContractService.RebateTableHeader.Edit",
      "ContractService.RebateTableHeader.Delete",
    ],
    lang: params.lang,
  });

  const { languageData } = await getResourceData(params.lang);
  const details = await getRebateTableHeadersByIdApi(params.id);
  if (details.type !== "success") return notFound();

  return (
    <RebateTableHeaderUpdateForm
      formData={details.data}
      languageData={languageData}
    />
  );
}
