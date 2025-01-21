import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GetApiFinanceServiceVatStatementHeadersByIdResponse } from "@ayasofyazilim/saas/FinanceService";
import type { GetApiTagServiceTagByIdDetailResponse } from "@ayasofyazilim/saas/TagService";
import { CheckIcon, ClockIcon } from "lucide-react";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";
import { dateToString } from "../utils";
import TagActions from "./tag-actions";

function ValidStatus({
  title,
  date,
  message,
}: {
  title: string;
  date?: string | null;
  message?: string[];
}) {
  return (
    <Card className="rounded-none">
      <CardHeader className="text-primary-800 flex flex-row space-y-0 pb-0 text-lg font-semibold">
        <div className="grid grid-cols-6 gap-x-2 gap-y-1">
          <div className="col-span-1 my-auto">
            <CheckIcon
              className={`size-7 rounded-full p-1 ${date ? "bg-blue-500 text-white" : "text-muted-foreground bg-muted"}`}
            />
          </div>
          <div className="col-span-5">
            <div className={date ? "" : "text-muted-foreground"}>{title}</div>
          </div>
          {date ? (
            <>
              <div className="col-span-1 my-auto" />
              <div className="col-span-5">
                <span className="text-primary-800 inline-flex items-center rounded bg-blue-200 px-2 py-0.5 text-xs font-medium">
                  <ClockIcon className="mr-1 h-4 w-4" />
                  {date}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="text-muted-foreground mt-0 text-sm">
        {message?.map((m, index) => <p key={index}>{m}</p>)}
      </CardContent>
    </Card>
  );
}

export default function TagStatusDiagram({
  tagDetail,
  tagVatStatementHeader,
  languageData,
}: {
  tagDetail: GetApiTagServiceTagByIdDetailResponse;
  tagVatStatementHeader: null | GetApiFinanceServiceVatStatementHeadersByIdResponse;
  languageData: TagServiceResource;
}) {
  return (
    <div className="grid h-max gap-3">
      <ValidStatus
        date={dateToString(tagDetail.issueDate, "tr")}
        title="Tag has been issued"
      />
      {tagDetail.exportValidation ? (
        <ValidStatus
          date={dateToString(tagDetail.exportValidation.exportDate, "tr")}
          message={[
            `Customs: ${tagDetail.exportValidation.customsName}`,
            `Reference Id: ${tagDetail.exportValidation.referenceId}`,
          ]}
          title="Tag has been export validationed"
        />
      ) : (
        <ValidStatus title="Tag awaits export validation" />
      )}
      {tagDetail.refund ? (
        <ValidStatus
          date={dateToString(tagDetail.refund.paidDate, "tr")}
          message={[
            `Refund Location: ${tagDetail.refund.refundLocation}`,
            `Refund Method: ${tagDetail.refund.refundMethod}`,
          ]}
          title="Tag has been refunded"
        />
      ) : (
        <ValidStatus title="Tag awaits refund" />
      )}
      {tagVatStatementHeader?.id ? (
        <ValidStatus
          date={dateToString(tagVatStatementHeader.vatStatementDate, "tr")}
          message={[
            `Invoice Number: ${tagDetail.refund?.refundLocation}`,
            `Merchant Name: ${tagDetail.refund?.refundMethod}`,
          ]}
          title="Vat statement has been created"
        />
      ) : (
        <ValidStatus title="Tag awaits vat statement" />
      )}
      <TagActions
        languageData={languageData}
        refundPoint
        tagDetail={tagDetail}
      />
    </div>
  );
}
