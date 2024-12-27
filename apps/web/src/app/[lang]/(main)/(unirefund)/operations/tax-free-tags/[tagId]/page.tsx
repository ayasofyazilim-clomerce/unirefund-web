"use server";

import { notFound } from "next/navigation";
import { getTagByIdApi } from "src/actions/unirefund/TagService/actions";
import { getResourceData } from "src/language-data/unirefund/TagService";
import MerchantDetails from "./_components/merchant-details";
import TagStatuses from "./_components/tag-statuses";
import TagSummary from "./_components/tag-summary";
import TagTabs from "./_components/tag-tabs";
import TravellerDetails from "./_components/traveller-details";

export default async function Page({
  params,
}: {
  params: { tagId: string; lang: string };
}) {
  const response = await getTagByIdApi({ id: params.tagId });
  const { languageData } = await getResourceData(params.lang);

  if (response.type !== "success") return notFound();

  const tagDetail = response.data;
  return (
    <div className="mb-2 grid h-full grid-cols-2 gap-3 overflow-auto">
      <TagSummary languageData={languageData} tagDetail={tagDetail} />
      <MerchantDetails languageData={languageData} tagDetail={tagDetail} />
      <TagStatuses languageData={languageData} tagDetail={tagDetail} />
      <TravellerDetails languageData={languageData} tagDetail={tagDetail} />
      <TagTabs languageData={languageData} tagDetail={tagDetail} />
    </div>
  );
}
