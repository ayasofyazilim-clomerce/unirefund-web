"use server";

import { notFound } from "next/navigation";
import { getTagById } from "src/actions/unirefund/TagService/actions";
import MerchantDetails from "./_components/merchant-details";
import TagSummary from "./_components/tag-summary";
import Totals from "./_components/totals";
import TravellerDetails from "./_components/traveller-details";

export default async function Page({ params }: { params: { tagId: string } }) {
  const response = await getTagById({ id: params.tagId });

  if (response.type !== "success") return notFound();

  const tagDetail = response.data;
  return (
    <div className="flex flex-row gap-3">
      <Totals tagDetail={tagDetail} />
      <div className="flex w-2/3 flex-col">
        <TagSummary tagDetail={tagDetail} />
      </div>
      <div className="flex w-1/3 flex-col">
        <MerchantDetails tagDetail={tagDetail} />
        <TravellerDetails tagDetail={tagDetail} />
      </div>
    </div>
  );
}
