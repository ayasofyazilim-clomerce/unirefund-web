"use server";

import Button from "@repo/ayasofyazilim-ui/molecules/button";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {auth} from "@repo/utils/auth/next-auth";
import {FileIcon, FileText, HandCoins, Plane, ReceiptText, Scale, Store} from "lucide-react";
import {isRedirectError} from "next/dist/client/components/redirect";
import Link from "next/link";
import {structuredError} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getVatStatementHeadersByIdApi} from "@repo/actions/unirefund/FinanceService/actions";
import {getRefundDetailByIdApi} from "@repo/actions/unirefund/RefundService/actions";
import {getProductGroupsApi} from "@repo/actions/unirefund/SettingService/actions";
import {getTagByIdApi} from "@repo/actions/unirefund/TagService/actions";
import {isUnauthorized} from "@repo/utils/policies";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {getResourceData} from "src/language-data/unirefund/TagService";
import {getBaseLink} from "src/utils";
import {dateToString, getStatusColor} from "../../_components/utils";
import Invoices from "./_components/invoices";
import TagCardList, {TagCard} from "./_components/tag-card";
import TagStatusDiagram from "./_components/tag-status-diagram";

async function getApiRequests(tagId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getTagByIdApi({id: tagId}),
      getProductGroupsApi({maxResultCount: 1}, session),
    ]);

    const tagDetail = requiredRequests[0].data;

    const optionalRequests = await Promise.allSettled([
      tagDetail.vatStatementHeaderId ? getVatStatementHeadersByIdApi(tagDetail.vatStatementHeaderId) : {data: null},
      tagDetail.refundId ? getRefundDetailByIdApi(tagDetail.refundId) : {data: null},
    ]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Page({params}: {params: {tagId: string; lang: string}}) {
  const {tagId, lang} = params;
  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests(tagId);
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {requiredRequests, optionalRequests} = apiRequests;
  const [tagDetailResponse, productGroupsResponse] = requiredRequests;
  const [vatStatementResponse, refundDetailResponse] = optionalRequests;

  const isThereAProductGroup = (productGroupsResponse.data.items?.length || 0) > 0;
  const tagDetail = tagDetailResponse.data;
  const vatStatementHeader = vatStatementResponse.status === "fulfilled" ? vatStatementResponse.value.data : null;
  const refundDetail = refundDetailResponse.status === "fulfilled" ? refundDetailResponse.value.data : null;

  const hasGrant = {
    TravellerDetail: await isUnauthorized({
      requiredPolicies: ["TravellerService.Travellers.Detail"],
      lang,
      redirect: false,
    }),
    MerchantDetail: await isUnauthorized({
      requiredPolicies: ["CRMService.Merchants.View"],
      lang,
      redirect: false,
    }),
  };
  return (
    <FormReadyComponent
      active={!isThereAProductGroup}
      content={{
        icon: <FileText className="size-20 text-gray-400" />,
        title: languageData["Missing.ProductGroups.Title"],
        message: languageData["Missing.ProductGroups.Message"],
        action: (
          <Button asChild className="text-blue-500" data-testid="new-product-group-button" variant="link">
            <Link data-testid="new-product-group-link" href={getBaseLink("settings/product/product-groups", lang)}>
              {languageData.New}
            </Link>
          </Button>
        ),
      }}>
      <div className="mb-3 grid h-full grid-cols-4 gap-1 pb-3 lg:gap-3">
        <div className="col-span-3 grid h-full grid-cols-6 gap-1 overflow-hidden lg:gap-3">
          <TagCardList
            icon={<FileIcon className="size-5" />}
            rows={[
              {
                name: languageData.TaxFreeTagID,
                value: tagDetail.tagNumber,
              },
              {
                name: languageData.Status,
                value: languageData[`TagStatus.${tagDetail.status}` as keyof TagServiceResource],
                className: getStatusColor(tagDetail.status),
              },
              {
                name: languageData.IssueDate,
                value: dateToString(tagDetail.issueDate || "", "tr"),
              },
            ]}
            title={languageData.TagSummary}
          />
          <TagCardList
            icon={<Plane className="size-5" />}
            rows={[
              {
                name: languageData.FullName,
                value: `${tagDetail.traveller?.firstname} ${tagDetail.traveller?.lastname}`,
                link: !hasGrant.TravellerDetail
                  ? getBaseLink(`parties/travellers/${tagDetail.traveller?.id}`)
                  : undefined,
              },
              {
                name: languageData.DocumentNo,
                value: tagDetail.traveller?.travelDocumentNumber || "",
              },
              {
                name: languageData.Residences,
                value: tagDetail.traveller?.countryOfResidence || "",
              },
              {
                name: languageData.Nationality,
                value: tagDetail.traveller?.nationality || "",
              },
            ]}
            title={languageData.TravellerDetails}
          />
          <TagCardList
            icon={<Store className="size-5" />}
            rows={[
              {
                name: languageData.StoreName,
                value: tagDetail.merchant?.name || "",
                link: !hasGrant.MerchantDetail
                  ? getBaseLink(`parties/merchants/${tagDetail.merchant?.id}/details`)
                  : undefined,
              },
              {
                name: languageData.Address,
                value: tagDetail.merchant?.address?.addressLine || "",
              },
              {
                name: languageData.ProductGroups,
                value: tagDetail.merchant?.productGroups?.map((p) => p.name).join(", ") || "",
              },
            ]}
            title={languageData.MerchantDetails}
          />
          <div className="col-span-4 row-span-2 h-full overflow-hidden">
            <TagCard icon={<ReceiptText className="size-5" />} title={languageData.Invoices}>
              <Invoices languageData={languageData} tagDetail={tagDetail} />
            </TagCard>
          </div>
          <div className="col-span-2 h-full">
            <TagCardList
              icon={<Scale className="size-5" />}
              rows={
                tagDetail.totals?.map((total) => ({
                  name: languageData[total.totalType],
                  value: `${total.amount} ${total.currency}`,
                })) || []
              }
              title={languageData.Totals}
            />
          </div>
          <div className="col-span-2">
            <TagCardList
              icon={<HandCoins className="size-5" />}
              rows={
                tagDetail.earnings?.map((earning) => ({
                  name: languageData[earning.earningType],
                  value: `${earning.amount} ${earning.currency}`,
                })) || []
              }
              title={languageData.Earnings}
            />
          </div>
        </div>

        <TagStatusDiagram
          languageData={languageData}
          tagDetail={tagDetail}
          tagRefundDetail={refundDetail}
          tagVatStatementHeader={vatStatementHeader}
        />
      </div>
    </FormReadyComponent>
  );
}
