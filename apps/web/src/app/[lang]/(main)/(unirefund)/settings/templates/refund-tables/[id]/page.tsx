import {notFound} from "next/navigation";
import {isUnauthorized} from "@repo/utils/policies";
import {getRefundTableHeadersByIdApi} from "@repo/actions/unirefund/ContractService/action";
import {getResourceData} from "@/language-data/unirefund/ContractService";
import RefundTableHeaderUpdateForm from "./_components/form";

export default async function Page({params}: {params: {lang: string; id: string}}) {
  const {id} = params;
  await isUnauthorized({
    requiredPolicies: [
      "ContractService.RefundTableHeader.Create",
      "ContractService.RefundTableHeader.Edit",
      "ContractService.RefundTableHeader.Delete",
      "ContractService.RefundTableHeader.View",
      "ContractService.RefundTableHeader.ViewDetail",
    ],
    lang: params.lang,
  });

  const response = await getRefundTableHeadersByIdApi(id);
  if (response.type !== "success") return notFound();

  const {languageData} = await getResourceData(params.lang);

  return <RefundTableHeaderUpdateForm formData={response.data} languageData={languageData} />;
}
