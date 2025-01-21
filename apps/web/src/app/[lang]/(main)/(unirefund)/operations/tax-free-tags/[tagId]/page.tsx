"use server";

import type { UniRefund_SettingService_ProductGroups_ProductGroupDto } from "@ayasofyazilim/saas/SettingService";
import Button from "@repo/ayasofyazilim-ui/molecules/button";
import { FormReadyComponent } from "@repo/ui/form-ready";
import { FileIcon, FileText, Plane, ReceiptText, Store } from "lucide-react";
import Link from "next/link";
import { getVatStatementHeadersByIdApi } from "src/actions/unirefund/FinanceService/actions";
import { getProductGroupsApi } from "src/actions/unirefund/SettingService/actions";
import { getTagByIdApi } from "src/actions/unirefund/TagService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/TagService";
import { getBaseLink } from "src/utils";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Invoices from "./_components/invoices";
import TagCardList, { TagCard } from "./_components/tag-card";
import TagStatusDiagram from "./_components/tag-status-diagram";
import { dateToString, getStatusColor } from "./utils";

export default async function Page({
  params,
}: {
  params: { tagId: string; lang: string };
}) {
  const { tagId, lang } = params;
  const { languageData } = await getResourceData(lang);

  const tagDetailResponse = await getTagByIdApi({ id: tagId });
  if (isErrorOnRequest(tagDetailResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={tagDetailResponse.message}
      />
    );
  }

  //this will change in the future
  const productGroupsResponse = await getProductGroupsApi({
    maxResultCount: 1000,
  });
  if (isErrorOnRequest(productGroupsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={productGroupsResponse.message}
      />
    );
  }
  const productGroups: UniRefund_SettingService_ProductGroups_ProductGroupDto[] =
    productGroupsResponse.data.items || [];

  const tagDetail = tagDetailResponse.data;
  const tagVatStatementHeadersResponse = tagDetail.vatStatementHeaderId
    ? await getVatStatementHeadersByIdApi(tagDetail.vatStatementHeaderId)
    : null;
  const tagVatStatementHeader =
    tagVatStatementHeadersResponse?.type === "success"
      ? tagVatStatementHeadersResponse.data
      : null;

  return (
    <FormReadyComponent
      active={productGroups.length === 0}
      content={{
        icon: <FileText className="size-20 text-gray-400" />,
        title: languageData["Missing.ProductGroups.Title"],
        message: languageData["Missing.ProductGroups.Message"],
        action: (
          <Button asChild className="text-blue-500" variant="link">
            <Link href={getBaseLink("settings/product/product-groups", lang)}>
              {languageData.New}
            </Link>
          </Button>
        ),
      }}
    >
      <div className="mb-3 grid grid-cols-4 gap-3 overflow-auto pt-3">
        <div className="col-span-3 grid grid-cols-3 gap-3">
          <TagCardList
            icon={<FileIcon />}
            rows={[
              {
                name: languageData.TaxFreeTagID,
                value: tagDetail.tagNumber,
              },
              {
                name: languageData.Status,
                value: tagDetail.status,
                className: getStatusColor(tagDetail.status),
              },
              {
                name: "Issue Date",
                value: dateToString(tagDetail.issueDate || "", "tr"),
              },
              {
                name: "Expiration Date",
                value: dateToString(tagDetail.expireDate || "", "tr"),
              },
            ]}
            title={languageData.TagSummary}
          />
          <TagCardList
            icon={<Plane />}
            rows={[
              {
                name: languageData.FullName,
                value: `${tagDetail.traveller?.firstname} ${tagDetail.traveller?.lastname}`,
                link:
                  getBaseLink("parties/travellers/") + tagDetail.traveller?.id,
              },
              {
                name: languageData.TravellerDocumentNo,
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
            icon={<Store />}
            rows={[
              {
                name: languageData.StoreName,
                value: tagDetail.merchant?.name || "",
                link:
                  getBaseLink("parties/merchants/") + tagDetail.merchant?.id,
              },
              {
                name: languageData.Address,
                value: tagDetail.merchant?.address?.fullText || "",
              },
              {
                name: languageData.ProductGroups,
                value:
                  tagDetail.merchant?.productGroups
                    ?.map((p) => p.description)
                    .join(", ") || "",
              },
            ]}
            title={languageData.MerchantDetails}
          />
          <div className="col-span-full">
            <TagCard icon={<ReceiptText />} title="Invoices">
              <Invoices languageData={languageData} tagDetail={tagDetail} />
            </TagCard>
          </div>
        </div>

        <TagStatusDiagram
          languageData={languageData}
          tagDetail={tagDetail}
          tagVatStatementHeader={tagVatStatementHeader}
        />
      </div>
    </FormReadyComponent>
  );
}
