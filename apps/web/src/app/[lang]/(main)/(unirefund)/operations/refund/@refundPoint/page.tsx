import {getPaymentTypesByRefundPointIdApi} from "@repo/actions/unirefund/ContractService/action";
import {getRefundableTagsApi} from "@repo/actions/unirefund/TagService/actions";
import {getTravellersApi} from "@repo/actions/unirefund/TravellerService/actions";
import type {UniRefund_ContractService_Enums_RefundMethod} from "@repo/saas/ContractService";
import {auth} from "@repo/utils/auth/next-auth";
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
    tagIds?: string;
  };
}) {
  const session = await auth();
  const {travellerDocumentNumber, tagIds, status, refundType} = searchParams;

  const {languageData} = await getResourceData(params.lang);
  const refundPointId = Array.isArray(session?.user?.RefundPointId)
    ? session.user.RefundPointId[0]
    : session?.user?.RefundPointId;

  if (!refundPointId) {
    return <div className="m-4">{languageData.NoAccessibleRefundPoints}</div>;
  }
  const travellerResponse = travellerDocumentNumber
    ? await getTravellersApi({
        travellerDocumentNumber,
      }).then((res) => res.data.items?.[0])
    : undefined;

  const paymentTypesResponse = await getPaymentTypesByRefundPointIdApi(refundPointId);

  const tagResponse = status
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
      accessibleRefundPoints={[]}
      languageData={languageData}
      paymentTypesResponse={paymentTypesResponse.type === "success" ? paymentTypesResponse.data : undefined}
      refundPointId={refundPointId}
      tagResponse={tagResponse?.type === "success" ? tagResponse.data : undefined}
      travellerResponse={travellerResponse}
    />
  );
}

export default Page;
