import { Separator } from "@/components/ui/separator";
import type { UniRefund_TagService_Tags_TagDetailDto } from "@ayasofyazilim/saas/TagService";
import { Fragment } from "react";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";

function createClassName(type: string) {
  let className = "";
  switch (type) {
    case "Refund":
    case "SalesAmount":
    case "NetComission":
      className = "font-bold";
      break;
    default:
      break;
  }
  return className;
}

export default function TotalsEarnings({
  tagDetail,
  languageData,
}: {
  tagDetail: UniRefund_TagService_Tags_TagDetailDto;
  languageData: TagServiceResource;
}) {
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <div className="col-span-2">TOTALS</div>
      <div className="grid grid-cols-2 gap-2 text-right">
        {tagDetail.totals?.map((total) => (
          <Fragment key={total.totalType}>
            <div>{languageData[total.totalType]}</div>
            <div className={createClassName(total.totalType)}>
              {total.amount} {total.currency}
            </div>
          </Fragment>
        ))}
      </div>
      <Separator className="col-span-full" />
      <div className="col-span-2">EARNINGS</div>
      <div className="grid grid-cols-2 gap-2 text-right">
        {tagDetail.earnings?.map((total) => (
          <Fragment key={total.earningType}>
            <div>{languageData[total.earningType]}</div>
            <div className={createClassName(total.earningType)}>
              {total.amount} {total.currency}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
