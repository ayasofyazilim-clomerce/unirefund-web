"use server";

import { notFound } from "next/navigation";
import { getTagById } from "src/actions/unirefund/TagService/actions";
import { getResourceData } from "src/language-data/unirefund/TagService";
import MerchantDetails from "./_components/merchant-details";
import TagSummary from "./_components/tag-summary";
import Totals from "./_components/totals";
import TravellerDetails from "./_components/traveller-details";

export default async function Page({
  params,
}: {
  params: { tagId: string; lang: string };
}) {
  const response = await getTagById({ id: params.tagId });
  const { languageData } = await getResourceData(params.lang);

  if (response.type !== "success") return notFound();

  const tagDetail = response.data;
  return (
    <div className="flex flex-row gap-3">
      <Totals languageData={languageData} tagDetail={tagDetail} />
      <div className="flex w-2/3 flex-col">
        <TagSummary languageData={languageData} tagDetail={tagDetail} />
      </div>
      <div className="flex w-1/3 flex-col">
        <MerchantDetails tagDetail={tagDetail} />
        <TravellerDetails tagDetail={tagDetail} />
      </div>
    </div>
  );
}
