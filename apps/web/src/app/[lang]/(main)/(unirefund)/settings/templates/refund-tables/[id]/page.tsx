import { notFound } from "next/navigation";
import { getRefundTableHeadersById } from "src/actions/unirefund/ContractService/action";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import Form from "./form";
import RefundTableDetailsForm from "./table";

export default async function Page({
  params,
}: {
  params: { lang: string; id: string };
}) {
  await isUnauthorized({
    requiredPolicies: [
      "ContractService.RefundTableDetail.Create",
      "ContractService.RefundTableDetail.Edit",
      "ContractService.RefundTableDetail.Delete",
      "ContractService.RefundTableHeader.Create",
      "ContractService.RefundTableHeader.Edit",
      "ContractService.RefundTableHeader.Delete",
    ],
    lang: params.lang,
  });

  const response = await getRefundTableHeadersById({ id: params.id });
  if (response.type !== "success") return notFound();

  const { languageData } = await getResourceData(params.lang);

  return (
    <>
      <Form languageData={languageData} response={response.data} />
      <RefundTableDetailsForm
        languageData={languageData}
        response={response.data}
      />
      <div className="hidden" id="page-title">
        {response.data.name}
      </div>
      <div className="hidden" id="page-description">
        {languageData["RefundTables.Edit.Description"]}
      </div>
    </>
  );
}
