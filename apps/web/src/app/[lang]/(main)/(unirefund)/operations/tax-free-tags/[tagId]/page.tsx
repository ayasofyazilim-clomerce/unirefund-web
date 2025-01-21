"use server";

import type { UniRefund_SettingService_ProductGroups_ProductGroupDto } from "@ayasofyazilim/saas/SettingService";
import Button from "@repo/ayasofyazilim-ui/molecules/button";
import { FormReadyComponent } from "@repo/ui/form-ready";
import { FileText } from "lucide-react";
import Link from "next/link";
import { getAccessibleRefundPointsApi } from "src/actions/unirefund/CrmService/actions";
import { getProductGroupsApi } from "src/actions/unirefund/SettingService/actions";
import { getTagByIdApi } from "src/actions/unirefund/TagService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/TagService";
import { getBaseLink } from "src/utils";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import MerchantDetails from "./_components/merchant-details";
import TagActions from "./_components/tag-actions";
import TagStatuses from "./_components/tag-statuses";
import TagSummary from "./_components/tag-summary";
import TravellerDetails from "./_components/traveller-details";

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

  const accessibleRefundPointsResponse = await getAccessibleRefundPointsApi({
    maxResultCount: 1,
  });
  const accessibleRefundPoints =
    (accessibleRefundPointsResponse.type === "success" &&
      accessibleRefundPointsResponse.data.items) ||
    [];

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
      <div className="mb-2 grid h-full grid-cols-2 gap-3 overflow-auto">
        <TagActions
          languageData={languageData}
          refundPoint={accessibleRefundPoints.length > 0}
          tagDetail={tagDetail}
        />

        <TagSummary languageData={languageData} tagDetail={tagDetail} />
        <MerchantDetails languageData={languageData} tagDetail={tagDetail} />
        <TagStatuses languageData={languageData} tagDetail={tagDetail} />
        <TravellerDetails languageData={languageData} tagDetail={tagDetail} />
      </div>
    </FormReadyComponent>
  );
}
