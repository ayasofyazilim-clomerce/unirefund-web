"use server";
import {isUnauthorized} from "@repo/utils/policies";
import {notFound} from "next/navigation";
import {getRefundFeeHeadersByIdApi} from "@repo/actions/unirefund/ContractService/action";
import {getResourceData} from "@/language-data/unirefund/ContractService";
import RefundFeeHeaderUpdateForm from "./_components/form";

export default async function Page({params}: {params: {lang: string; id: string}}) {
  const {id} = params;
  await isUnauthorized({
    requiredPolicies: [
      "ContractService.RefundFeeDetail.Create",
      "ContractService.RefundFeeDetail.Edit",
      "ContractService.RefundFeeDetail.Delete",
      "ContractService.RefundFeeHeader.Create",
      "ContractService.RefundFeeHeader.Edit",
      "ContractService.RefundFeeHeader.Delete",
    ],
    lang: params.lang,
  });

  const response = await getRefundFeeHeadersByIdApi(id);
  if (response.type !== "success") return notFound();

  const {languageData} = await getResourceData(params.lang);
  return <RefundFeeHeaderUpdateForm formData={response.data} languageData={languageData} />;
}
