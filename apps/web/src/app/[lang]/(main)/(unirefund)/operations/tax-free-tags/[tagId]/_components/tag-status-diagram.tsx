import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GetApiFinanceServiceVatStatementHeadersByIdResponse } from "@ayasofyazilim/saas/FinanceService";
import type { GetApiTagServiceTagByIdDetailResponse } from "@ayasofyazilim/saas/TagService";
import { ClockIcon, SquareArrowOutUpRight } from "lucide-react";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";
import { dateToString } from "../utils";
import TagActions from "./tag-actions";

function ValidStatus({
  title,
  link,
  date,
  message,
}: {
  title: string;
  link?: string;
  date?: string | null;
  message?: string[];
}) {
  return (
    <Card className="rounded-none">
      <CardHeader className="text-primary-800 flex flex-row space-y-0 pb-0 text-lg font-semibold">
        <div className="grid grid-cols-6 gap-x-2 gap-y-1">
          <div className="col-span-full">
            <div className={date ? "" : "text-muted-foreground"}>
              {link ? (
                <a
                  className="flex flex-row items-center text-blue-700"
                  href={link}
                >
                  <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
                  {title}
                </a>
              ) : (
                title
              )}
            </div>
            {date ? (
              <span className="text-primary-800 inline-flex items-center rounded bg-blue-200 px-2 py-0.5 text-xs font-medium">
                <ClockIcon className="mr-1 h-4 w-4" />
                {date}
              </span>
            ) : null}
          </div>
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
        link={`/operations/tax-free-tags/${tagDetail.id}`}
        title="Issue"
      />
      {tagDetail.exportValidation ? (
        <ValidStatus
          date={dateToString(tagDetail.exportValidation.exportDate, "tr")}
          link={`/operations/export-validations/${tagDetail.exportValidation.id}`}
          message={[
            `Customs: ${tagDetail.exportValidation.customsName}`,
            `Reference Id: ${tagDetail.exportValidation.referenceId}`,
          ]}
          title="Export Validation"
        />
      ) : (
        <ValidStatus title="Tag awaits export validation" />
      )}
      {tagDetail.refund ? (
        <ValidStatus
          date={dateToString(tagDetail.refund.paidDate, "tr")}
          link={`/operations/refunds/${tagDetail.refund.id}`}
          message={[
            `Refund Location: ${tagDetail.refund.refundLocation}`,
            `Refund Method: ${tagDetail.refund.refundMethod}`,
          ]}
          title="Refund"
        />
      ) : (
        <ValidStatus title="Refund" />
      )}
      {tagVatStatementHeader?.id ? (
        <ValidStatus
          date={dateToString(tagVatStatementHeader.vatStatementDate, "tr")}
          link={`/operations/vat-statements/${tagVatStatementHeader.id}`}
          message={[
            `Invoice Number: ${tagDetail.refund?.refundLocation}`,
            `Merchant Name: ${tagDetail.refund?.refundMethod}`,
          ]}
          title="Vat Statement"
        />
      ) : (
        <ValidStatus title="Vat Statement" />
      )}
      <TagActions
        languageData={languageData}
        refundPoint
        tagDetail={tagDetail}
      />
    </div>
  );
}
