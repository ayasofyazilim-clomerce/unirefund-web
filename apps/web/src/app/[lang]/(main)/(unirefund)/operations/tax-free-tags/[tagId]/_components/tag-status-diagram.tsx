import {Card, CardContent, CardHeader} from "@/components/ui/card";
import type {GetApiFinanceServiceVatStatementHeadersByIdResponse} from "@repo/saas/FinanceService";
import type {GetApiTagServiceTagByIdDetailResponse} from "@repo/saas/TagService";
import {ClockIcon, SquareArrowOutUpRight} from "lucide-react";
import type {UniRefund_RefundService_Refunds_GetDetailAsync_RefundDetailDto} from "@repo/saas/RefundService";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import {dateToString} from "../../../_components/utils";
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
      <CardHeader className="text-primary-800 flex flex-row space-y-0 px-6 pb-0 pt-3 text-lg font-semibold">
        <div className="grid w-full grid-cols-6 gap-x-2 gap-y-1">
          <div className="col-span-full">
            <div className={date ? "mb-2" : "text-muted-foreground mb-2"}>
              {link ? (
                <a className="flex flex-row items-center text-blue-700" href={link}>
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
  tagRefundDetail,
  languageData,
}: {
  tagDetail: GetApiTagServiceTagByIdDetailResponse;
  tagVatStatementHeader: GetApiFinanceServiceVatStatementHeadersByIdResponse | null;
  tagRefundDetail: UniRefund_RefundService_Refunds_GetDetailAsync_RefundDetailDto | null;
  languageData: TagServiceResource;
}) {
  return (
    <div className=" h-max gap-3">
      <ValidStatus
        date={dateToString(tagDetail.issueDate, "tr")}
        link={`/operations/tax-free-tags/${tagDetail.id}`}
        title={languageData.Issue}
      />
      {tagDetail.exportValidation ? (
        <ValidStatus
          date={dateToString(tagDetail.exportValidation.exportDate, "tr")}
          link={`/operations/export-validations/${tagDetail.exportValidation.id}`}
          message={[
            `${languageData.CustomTitle}: ${tagDetail.exportValidation.customsName}`,
            `${languageData.ReferenceId}: ${tagDetail.exportValidation.referenceId}`,
          ]}
          title={languageData.ExportValidation}
        />
      ) : (
        <ValidStatus title={languageData.WaitingExportValidation} />
      )}
      {tagRefundDetail ? (
        <ValidStatus
          date={dateToString(tagRefundDetail.paidDate, "tr")}
          // link={`/operations/refunds/${tagDetail.refundId}`}
          message={[
            `${languageData.RefundPoint}: ${tagRefundDetail.refundPoint.name}`,
            `${languageData.RefundMethod}: ${tagRefundDetail.refundTypeEnum}`,
          ]}
          title={languageData.Refund}
        />
      ) : (
        <ValidStatus title={languageData.Refund} />
      )}
      {tagVatStatementHeader?.id ? (
        <ValidStatus
          date={dateToString(tagVatStatementHeader.vatStatementDate, "tr")}
          link={`/finance/vat-statements/${tagVatStatementHeader.id}/information`}
          message={[
            `${languageData.InvoiceNumber}: ${tagVatStatementHeader.invoiceNumber}`,
            `${languageData.MerchantTitle}: ${tagVatStatementHeader.merchantName}`,
          ]}
          title={languageData.VatStatement}
        />
      ) : (
        <ValidStatus title={languageData.VatStatement} />
      )}
      <TagActions languageData={languageData} refundPoint tagDetail={tagDetail} />
    </div>
  );
}
