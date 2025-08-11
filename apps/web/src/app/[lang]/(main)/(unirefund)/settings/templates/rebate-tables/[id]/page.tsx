"use server";
import {notFound} from "next/navigation";
import {isUnauthorized} from "@repo/utils/policies";
import {getRebateTableHeadersByIdApi} from "@repo/actions/unirefund/ContractService/action";
import {getResourceData} from "@/language-data/unirefund/ContractService";
import RebateTableHeaderUpdateForm from "./_components/form";

export default async function Page({params}: {params: {lang: string; type: string; id: string}}) {
  await isUnauthorized({
    requiredPolicies: [
      "ContractService.RebateTableHeader.Create",
      "ContractService.RebateTableHeader.Edit",
      "ContractService.RebateTableHeader.ViewDetail",
    ],
    lang: params.lang,
  });

  const {languageData} = await getResourceData(params.lang);
  const details = await getRebateTableHeadersByIdApi(params.id);
  if (details.type !== "success") return notFound();

  return <RebateTableHeaderUpdateForm formData={details.data} languageData={languageData} />;
}
