import {getPaymentTypesByRefundPointIdApi} from "@repo/actions/unirefund/ContractService/action";
import {getRefundPointsApi} from "@repo/actions/unirefund/CrmService/actions";
import {getRefundableTagsApi} from "@repo/actions/unirefund/TagService/actions";
import {getTravellersApi} from "@repo/actions/unirefund/TravellerService/actions";
import type {UniRefund_ContractService_Enums_RefundMethod} from "@repo/saas/ContractService";
import {getResourceData} from "@/language-data/unirefund/TagService";
import {ClientPage} from "../client-page";

async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: {
    travellerDocumentNumber?: string;
    refundType?: UniRefund_ContractService_Enums_RefundMethod;
    status: string;
    refundPointId?: string;
    tagIds?: string;
  };
}) {
  const {travellerDocumentNumber, tagIds, refundPointId, status, refundType} = searchParams;
  const {languageData} = await getResourceData(params.lang);

  const accessibleRefundPoints = await getRefundPointsApi().then((res) => res.data.items || []);

  const travellerResponse = travellerDocumentNumber
    ? await getTravellersApi({
        travellerDocumentNumber,
      }).then((res) => res.data.items?.[0])
    : undefined;

  const paymentTypesResponse = refundPointId ? await getPaymentTypesByRefundPointIdApi(refundPointId || "") : undefined;

  const tagResponse =
    status && refundPointId
      ? await getRefundableTagsApi({
          refundPointId,
          refundType,
          travellerDocumentNumber,
          isExportValidated: status !== "need-validation",
          tagIds: tagIds ? [tagIds] : undefined,
          maxResultCount: 100,
        })
      : undefined;

  return (
    <ClientPage
      accessibleRefundPoints={accessibleRefundPoints}
      languageData={languageData}
      paymentTypesResponse={paymentTypesResponse?.type === "success" ? paymentTypesResponse.data : undefined}
      tagResponse={tagResponse?.type === "success" ? tagResponse.data : undefined}
      travellerResponse={travellerResponse}
    />
  );
}

export default Page;
