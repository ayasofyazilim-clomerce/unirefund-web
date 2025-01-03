"use server";

import { getTagByIdApi } from "src/actions/unirefund/TagService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/TagService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import { getAccessibleRefundPointsApi } from "src/actions/unirefund/CrmService/actions";
import MerchantDetails from "./_components/merchant-details";
import TagStatuses from "./_components/tag-statuses";
import TagSummary from "./_components/tag-summary";
import TagTabs from "./_components/tag-tabs";
import TravellerDetails from "./_components/traveller-details";
import TagActions from "./_components/tag-actions";

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

  const accessibleRefundPointsResponse = await getAccessibleRefundPointsApi();
  const accessibleRefundPoints =
    (accessibleRefundPointsResponse.type === "success" &&
      accessibleRefundPointsResponse.data.items) ||
    [];

  const tagDetail = tagDetailResponse.data;
  return (
    <div className="mb-2 grid h-full grid-cols-2 gap-3 overflow-auto">
      {accessibleRefundPoints.length > 0 && (
        <TagActions
          accessibleRefundPoints={accessibleRefundPoints}
          languageData={languageData}
          tagDetail={tagDetail}
        />
      )}
      <TagSummary languageData={languageData} tagDetail={tagDetail} />
      <MerchantDetails languageData={languageData} tagDetail={tagDetail} />
      <TagStatuses languageData={languageData} tagDetail={tagDetail} />
      <TravellerDetails languageData={languageData} tagDetail={tagDetail} />
      <TagTabs languageData={languageData} tagDetail={tagDetail} />
    </div>
  );
}
